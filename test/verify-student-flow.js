import assert from 'assert';
import {
  TENANT_STUDENTS,
  registerStudent,
  updateStudent,
  getStudentsList,
  getStudentByAdmNo,
  saveBulkStudents
} from '../backend/src/modules/students/students.controller.js';

// Helper to mock Express req and res
function createMockContext(overrides = {}) {
  const req = {
    headers: overrides.headers || {},
    schoolId: overrides.schoolId,
    user: overrides.user,
    params: overrides.params || {},
    query: overrides.query || {},
    body: overrides.body || {}
  };

  let statusCode = 200;
  let responseData = null;

  const res = {
    status(code) {
      statusCode = code;
      return res;
    },
    json(data) {
      responseData = data;
      return res;
    }
  };

  const next = (err) => {
    if (err) throw err;
  };

  return {
    req,
    res,
    next,
    getStatusCode: () => statusCode,
    getResponseData: () => responseData
  };
}

async function runTests() {
  console.log('====================================================');
  console.log('STARTING AUTOMATED VERIFICATION: STUDENT FLOW & MULTI-TENANCY');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}`);
      console.error(err);
      failed++;
    }
  }

  // 1. Initial State: Zero hardcoded mock student records
  test('R2: Hardcoded mock student records are removed from TENANT_STUDENTS', () => {
    const jdStudents = TENANT_STUDENTS['sch_jd_intl'] || [];
    const dpsStudents = TENANT_STUDENTS['sch_dps_branch2'] || [];
    assert.strictEqual(jdStudents.length, 0, `Expected 0 mock students in sch_jd_intl, got ${jdStudents.length}`);
    assert.strictEqual(dpsStudents.length, 0, `Expected 0 mock students in sch_dps_branch2, got ${dpsStudents.length}`);
    const devFound = jdStudents.some(s => s.firstName === 'dev' || s.admNo === '1001');
    assert.strictEqual(devFound, false, 'Hardcoded student "dev" (1001) must not exist in initial TENANT_STUDENTS');
  });

  // 2. Student Creation: Register a new student
  let initialStudentId = null;
  let initialCreatedAt = null;

  await (async () => {
    const ctx = createMockContext({
      headers: { 'x-school-id': 'sch_jd_intl' },
      body: {
        adm_no: '1001',
        sr_no: '1001',
        first_name: 'Aarav',
        last_name: 'Sharma',
        class_id: 'X',
        division_id: 'A',
        fathers_mobile_no: '9876543210'
      }
    });

    await registerStudent(ctx.req, ctx.res, ctx.next);

    test('R1: Register new student returns HTTP 201 with correct tenant isolation', () => {
      assert.strictEqual(ctx.getStatusCode(), 201, 'Status code must be 201 Created');
      const data = ctx.getResponseData();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.data.admNo, '1001');
      assert.strictEqual(data.data.firstName, 'Aarav');
      assert.strictEqual(data.data.lastName, 'Sharma');
      assert.strictEqual(data.data.className, 'X');
      assert.strictEqual(data.data.schoolId, 'sch_jd_intl');
      assert.ok(data.data.id, 'Student must have an ID assigned');
      initialStudentId = data.data.id;
      initialCreatedAt = data.data.createdAt;
      assert.strictEqual(TENANT_STUDENTS['sch_jd_intl'].length, 1, 'Tenant must have exactly 1 student');
    });
  })();

  // 3. In-Place Update via registerStudent on duplicate admission number
  await (async () => {
    const ctx = createMockContext({
      headers: { 'x-school-id': 'sch_jd_intl' },
      body: {
        adm_no: '1001', // Duplicate admission number!
        sr_no: '1001',
        first_name: 'Aarav',
        last_name: 'Verma', // Modified last name
        class_id: 'XI', // Modified class
        division_id: 'B',
        fathers_mobile_no: '9998887776'
      }
    });

    await registerStudent(ctx.req, ctx.res, ctx.next);

    test('R1: Submitting modifications for existing admission number updates in-place without duplicate', () => {
      assert.strictEqual(ctx.getStatusCode(), 200, 'Status code must be 200 OK for update');
      const data = ctx.getResponseData();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.data.admNo, '1001');
      assert.strictEqual(data.data.lastName, 'Verma', 'Last name should be updated');
      assert.strictEqual(data.data.className, 'XI', 'Class should be updated');
      assert.strictEqual(data.data.section, 'B', 'Section should be updated');
      assert.strictEqual(data.data.id, initialStudentId, 'Original student ID must be preserved');
      assert.strictEqual(data.data.createdAt, initialCreatedAt, 'Original createdAt must be preserved');
      assert.ok(data.data.updatedAt, 'updatedAt timestamp must be set');
      assert.strictEqual(
        TENANT_STUDENTS['sch_jd_intl'].length,
        1,
        'Tenant sch_jd_intl must still have exactly 1 student (NO DUPLICATE ENTRY)'
      );
    });
  })();

  // 4. In-Place Update via updateStudent (PUT endpoint)
  await (async () => {
    const ctx = createMockContext({
      headers: { 'x-school-id': 'sch_jd_intl' },
      params: { admNo: '  1001  ' }, // Whitespace padded admission number!
      body: {
        first_name: 'Aarav',
        last_name: 'Kumar',
        sr_no: 'SR-1001-A',
        fee_id: 'Day Scholar Plus',
        stu_type: 'Existing',
        status_type: 'Studying',
        mothers_whatsapp_no: '9888877777',
        mothers_email: 'mother@example.com',
        present_address: '123 New Town, Jaipur'
      }
    });

    await updateStudent(ctx.req, ctx.res, ctx.next);

    test('R1: updateStudent modifies student record in-place by admission number and updates all fields', () => {
      assert.strictEqual(ctx.getStatusCode(), 200, 'Status code must be 200 OK');
      const data = ctx.getResponseData();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.data.admNo, '1001');
      assert.strictEqual(data.data.lastName, 'Kumar');
      assert.strictEqual(data.data.srNo, 'SR-1001-A');
      assert.strictEqual(data.data.feeType, 'Day Scholar Plus');
      assert.strictEqual(data.data.studentType, 'Existing');
      assert.strictEqual(data.data.motherWhatsapp, '9888877777');
      assert.strictEqual(data.data.motherEmail, 'mother@example.com');
      assert.strictEqual(data.data.address, '123 New Town, Jaipur');
      assert.strictEqual(data.data.id, initialStudentId, 'ID must remain unchanged');
      assert.strictEqual(TENANT_STUDENTS['sch_jd_intl'].length, 1, 'Length must remain 1');
    });
  })();

  // 5. Multiple student registration & duplicate prevention
  await (async () => {
    // Add student 1002
    const ctx2 = createMockContext({
      headers: { 'x-school-id': 'sch_jd_intl' },
      body: { adm_no: '1002', first_name: 'Diya', last_name: 'Patel', class_id: 'V' }
    });
    await registerStudent(ctx2.req, ctx2.res, ctx2.next);

    // Attempt to register student 1002 again with changed details
    const ctx2dup = createMockContext({
      headers: { 'x-school-id': 'sch_jd_intl' },
      body: { adm_no: '1002', first_name: 'Diya', last_name: 'Shah', class_id: 'VI' }
    });
    await registerStudent(ctx2dup.req, ctx2dup.res, ctx2dup.next);

    // Attempt to register student 1001 again
    const ctx1dup = createMockContext({
      headers: { 'x-school-id': 'sch_jd_intl' },
      body: { adm_no: '1001', first_name: 'Aarav', last_name: 'Kumar', class_id: 'XII' }
    });
    await registerStudent(ctx1dup.req, ctx1dup.res, ctx1dup.next);

    test('R1: Duplicate prevention across multiple records', () => {
      assert.strictEqual(
        TENANT_STUDENTS['sch_jd_intl'].length,
        2,
        `Expected exactly 2 students in sch_jd_intl, found ${TENANT_STUDENTS['sch_jd_intl'].length}`
      );
      const student1001 = TENANT_STUDENTS['sch_jd_intl'].find(s => s.admNo === '1001');
      const student1002 = TENANT_STUDENTS['sch_jd_intl'].find(s => s.admNo === '1002');
      assert.ok(student1001, 'Student 1001 must exist');
      assert.ok(student1002, 'Student 1002 must exist');
      assert.strictEqual(student1002.lastName, 'Shah', 'Student 1002 updated in-place');
      assert.strictEqual(student1001.className, 'XII', 'Student 1001 updated in-place');
    });
  })();

  // 6. Tenant Isolation: School B cannot see School A's students & can use same admission numbers independently
  await (async () => {
    // Query School B students
    const ctxListB = createMockContext({
      headers: { 'x-school-id': 'sch_dps_branch2' }
    });
    await getStudentsList(ctxListB.req, ctxListB.res, ctxListB.next);

    test('R2: Tenant isolation - School B has 0 students initially and cannot see School A students', () => {
      const data = ctxListB.getResponseData();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.count, 0, 'School B must have 0 students');
      assert.strictEqual(data.data.length, 0);
    });

    // Register student with adm_no '1001' in School B
    const ctxRegisterB = createMockContext({
      headers: { 'x-school-id': 'sch_dps_branch2' },
      body: {
        adm_no: '1001',
        first_name: 'Rohan',
        last_name: 'Mehta',
        class_id: 'IX'
      }
    });
    await registerStudent(ctxRegisterB.req, ctxRegisterB.res, ctxRegisterB.next);

    test('R2: School B can have its own student 1001 without affecting School A student 1001', () => {
      assert.strictEqual(ctxRegisterB.getStatusCode(), 201);
      assert.strictEqual(TENANT_STUDENTS['sch_dps_branch2'].length, 1);
      assert.strictEqual(TENANT_STUDENTS['sch_jd_intl'].length, 2);

      const schoolA_1001 = TENANT_STUDENTS['sch_jd_intl'].find(s => s.admNo === '1001');
      const schoolB_1001 = TENANT_STUDENTS['sch_dps_branch2'].find(s => s.admNo === '1001');

      assert.strictEqual(schoolA_1001.firstName, 'Aarav', 'School A student must remain Aarav');
      assert.strictEqual(schoolB_1001.firstName, 'Rohan', 'School B student must be Rohan');
      assert.notStrictEqual(schoolA_1001.id, schoolB_1001.id, 'IDs must be distinct across tenants');
    });

    // Query single student by admNo per tenant (testing whitespace padding & id lookup)
    const ctxGetA = createMockContext({
      headers: { 'x-school-id': 'sch_jd_intl' },
      params: { admNo: '  1001  ' }
    });
    await getStudentByAdmNo(ctxGetA.req, ctxGetA.res, ctxGetA.next);

    const ctxGetB = createMockContext({
      headers: { 'x-school-id': 'sch_dps_branch2' },
      params: { admNo: '1001' }
    });
    await getStudentByAdmNo(ctxGetB.req, ctxGetB.res, ctxGetB.next);

    const ctxGetById = createMockContext({
      headers: { 'x-school-id': 'sch_jd_intl' },
      params: { admNo: initialStudentId }
    });
    await getStudentByAdmNo(ctxGetById.req, ctxGetById.res, ctxGetById.next);

    test('R2: getStudentByAdmNo returns tenant-specific student record with whitespace trimming & ID support', () => {
      assert.strictEqual(ctxGetA.getStatusCode(), 200);
      assert.strictEqual(ctxGetA.getResponseData().data.firstName, 'Aarav');
      assert.strictEqual(ctxGetB.getStatusCode(), 200);
      assert.strictEqual(ctxGetB.getResponseData().data.firstName, 'Rohan');
      assert.strictEqual(ctxGetById.getStatusCode(), 200);
      assert.strictEqual(ctxGetById.getResponseData().data.id, initialStudentId);
    });
  })();

  // 7. Dynamic Tenant Creation: A completely new tenant operates cleanly
  await (async () => {
    const newSchoolId = 'sch_dynamic_tenant_99';
    const ctxDynamic = createMockContext({
      headers: { 'x-school-id': newSchoolId },
      body: { adm_no: '5001', first_name: 'Priya', last_name: 'Singh', class_id: 'III' }
    });
    await registerStudent(ctxDynamic.req, ctxDynamic.res, ctxDynamic.next);

    test('R2: Dynamically partition new tenant data cleanly', () => {
      assert.strictEqual(ctxDynamic.getStatusCode(), 201);
      assert.strictEqual(TENANT_STUDENTS[newSchoolId].length, 1);
      assert.strictEqual(TENANT_STUDENTS[newSchoolId][0].firstName, 'Priya');
    });
  })();

  // 8. Case-insensitive alphanumeric admission number in-place update & deduplication
  await (async () => {
    const ctxAlnum1 = createMockContext({
      headers: { 'x-school-id': 'sch_jd_intl' },
      body: { adm_no: 'ADM-909', first_name: 'Kavita', last_name: 'Rao', class_id: 'IV' }
    });
    await registerStudent(ctxAlnum1.req, ctxAlnum1.res, ctxAlnum1.next);

    const countBefore = TENANT_STUDENTS['sch_jd_intl'].length;

    // Register with lowercase 'adm-909'
    const ctxAlnum2 = createMockContext({
      headers: { 'x-school-id': 'sch_jd_intl' },
      body: { adm_no: 'adm-909', first_name: 'Kavita', last_name: 'Sharma', class_id: 'IV' }
    });
    await registerStudent(ctxAlnum2.req, ctxAlnum2.res, ctxAlnum2.next);

    test('R1: Case-insensitive admission number updates in-place without duplicate', () => {
      assert.strictEqual(ctxAlnum2.getStatusCode(), 200);
      assert.strictEqual(TENANT_STUDENTS['sch_jd_intl'].length, countBefore, 'Should not increase count');
      const student = TENANT_STUDENTS['sch_jd_intl'].find(s => s.admNo.toLowerCase() === 'adm-909');
      assert.ok(student, 'Student ADM-909 must exist');
      assert.strictEqual(student.lastName, 'Sharma', 'Last name should be updated');
    });

    // Case-insensitive query via getStudentByAdmNo
    const ctxGetCase = createMockContext({
      headers: { 'x-school-id': 'sch_jd_intl' },
      params: { admNo: 'adm-909' }
    });
    await getStudentByAdmNo(ctxGetCase.req, ctxGetCase.res, ctxGetCase.next);

    test('R2: getStudentByAdmNo supports case-insensitive admission numbers', () => {
      assert.strictEqual(ctxGetCase.getStatusCode(), 200);
      assert.strictEqual(ctxGetCase.getResponseData().data.firstName, 'Kavita');
    });
  })();

  // 9. saveBulkStudents deduplication with number / whitespace / case-different adm_no
  await (async () => {
    const schoolId = 'sch_bulk_verify';
    const ctxBulk = createMockContext({
      headers: { 'x-school-id': schoolId },
      body: {
        students: [
          { adm_no: 'BULK-101', first_name: 'Bulk', last_name: 'One', aadhaar: '111122223333' }
        ]
      }
    });
    await saveBulkStudents(ctxBulk.req, ctxBulk.res, ctxBulk.next);

    // Update the same student with lowercase adm_no and updated name
    const ctxBulkUpdate = createMockContext({
      headers: { 'x-school-id': schoolId },
      body: {
        students: [
          { adm_no: 'bulk-101', first_name: 'Bulk', last_name: 'Updated', aadhaar: '111122223333' }
        ]
      }
    });
    await saveBulkStudents(ctxBulkUpdate.req, ctxBulkUpdate.res, ctxBulkUpdate.next);

    test('R1: saveBulkStudents updates existing student in-place across case variations without duplicate', () => {
      assert.strictEqual(ctxBulkUpdate.getStatusCode(), 200);
      assert.strictEqual(TENANT_STUDENTS[schoolId].length, 1, 'Should have exactly 1 student');
      assert.strictEqual(TENANT_STUDENTS[schoolId][0].lastName, 'Updated');
    });
  })();

  console.log('\n====================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed with unhandled error:', err);
  process.exit(1);
});
