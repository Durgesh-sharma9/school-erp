import assert from 'assert';

// Mock localStorage and sessionStorage for Node.js environment
const createStorageMock = () => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
};

globalThis.localStorage = createStorageMock();
globalThis.sessionStorage = createStorageMock();
globalThis.window = { localStorage: globalThis.localStorage, sessionStorage: globalThis.sessionStorage };

const { tenantStore } = await import('../frontend/src/services/tenantStore.js');

console.log('====================================================');
console.log('STARTING CLIENT-SIDE TENANT STORE VERIFICATION');
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

// 1. Initial State
test('Initial tenantStore has 0 students for sch_jd_intl', () => {
  const students = tenantStore.getStudents('sch_jd_intl');
  assert.strictEqual(students.length, 0);
});

// 2. Add student
test('addStudent adds a new student to sch_jd_intl', () => {
  const s = tenantStore.addStudent('sch_jd_intl', {
    admNo: '1001',
    firstName: 'Dev',
    lastName: 'Sharma',
    className: 'X'
  });
  assert.ok(s);
  assert.strictEqual(s.admNo, '1001');
  const all = tenantStore.getStudents('sch_jd_intl');
  assert.strictEqual(all.length, 1);
});

// 3. Deduplication via addStudent with same admNo
test('addStudent with existing admNo updates record in-place instead of creating duplicate', () => {
  const updated = tenantStore.addStudent('sch_jd_intl', {
    admNo: '1001',
    firstName: 'Dev',
    lastName: 'Verma',
    className: 'XI'
  });
  assert.ok(updated);
  assert.strictEqual(updated.lastName, 'Verma');
  assert.strictEqual(updated.className, 'XI');
  const all = tenantStore.getStudents('sch_jd_intl');
  assert.strictEqual(all.length, 1, 'Should NOT create a second student entry');
  assert.strictEqual(all[0].lastName, 'Verma');
  assert.strictEqual(all[0].className, 'XI');
});

// 4. Update via updateStudent
test('updateStudent updates student in-place', () => {
  const updated = tenantStore.updateStudent('sch_jd_intl', '1001', {
    lastName: 'Kumar',
    status: 'Studying'
  });
  assert.ok(updated);
  assert.strictEqual(updated.lastName, 'Kumar');
  const all = tenantStore.getStudents('sch_jd_intl');
  assert.strictEqual(all.length, 1);
  assert.strictEqual(all[0].lastName, 'Kumar');
});

// 5. Tenant Isolation
test('tenantStore maintains strict isolation between school tenants', () => {
  const dpsStudents = tenantStore.getStudents('sch_dps_branch2');
  assert.strictEqual(dpsStudents.length, 0);

  tenantStore.addStudent('sch_dps_branch2', {
    admNo: '1001',
    firstName: 'Rohan',
    className: 'VIII'
  });

  const dpsAfter = tenantStore.getStudents('sch_dps_branch2');
  const jdAfter = tenantStore.getStudents('sch_jd_intl');
  assert.strictEqual(dpsAfter.length, 1);
  assert.strictEqual(jdAfter.length, 1);
  assert.strictEqual(dpsAfter[0].firstName, 'Rohan');
  assert.strictEqual(jdAfter[0].firstName, 'Dev');
});

// 6. Pending edit student clear
test('setPendingEditStudent and clearPendingEditStudent work cleanly', () => {
  tenantStore.setPendingEditStudent({ admNo: '1001', firstName: 'Dev' });
  assert.ok(sessionStorage.getItem('erp_pending_edit_student'));
  tenantStore.clearPendingEditStudent();
  assert.strictEqual(sessionStorage.getItem('erp_pending_edit_student'), null);
});

// 7. addStudent with snake_case adm_no deduplicates against existing camelCase admNo
test('addStudent with snake_case adm_no deduplicates and normalizes admNo', () => {
  const updated = tenantStore.addStudent('sch_jd_intl', {
    adm_no: '1001',
    first_name: 'Dev',
    last_name: 'Aggarwal'
  });
  assert.strictEqual(updated.admNo, '1001');
  assert.strictEqual(updated.last_name, 'Aggarwal');
  const all = tenantStore.getStudents('sch_jd_intl');
  assert.strictEqual(all.length, 1, 'Still only 1 student in sch_jd_intl');
});

// 8. updateStudent with whitespace in admNo
test('updateStudent with whitespace in admNo updates record in-place', () => {
  const updated = tenantStore.updateStudent('sch_jd_intl', '  1001  ', {
    lastName: 'Chopra'
  });
  assert.strictEqual(updated.admNo, '1001');
  assert.strictEqual(updated.lastName, 'Chopra');
  const all = tenantStore.getStudents('sch_jd_intl');
  assert.strictEqual(all.length, 1);
  assert.strictEqual(all[0].lastName, 'Chopra');
});

// 9. Case-insensitive admNo deduplication in addStudent
test('addStudent with case-different admNo updates record in-place without duplicate', () => {
  tenantStore.addStudent('sch_case_test', {
    admNo: 'ADM-707',
    firstName: 'Anita',
    lastName: 'Roy'
  });
  assert.strictEqual(tenantStore.getStudents('sch_case_test').length, 1);

  // Add with lowercase 'adm-707'
  const updated = tenantStore.addStudent('sch_case_test', {
    adm_no: 'adm-707',
    firstName: 'Anita',
    lastName: 'Sen'
  });
  assert.strictEqual(tenantStore.getStudents('sch_case_test').length, 1, 'Should NOT create duplicate');
  assert.strictEqual(updated.lastName, 'Sen');
});

// 10. Case-insensitive updateStudent updates record and sets isNew: false
test('updateStudent with lowercase admNo updates ADM-707 and marks isNew false', () => {
  const updated = tenantStore.updateStudent('sch_case_test', 'adm-707', {
    status: 'Graduated'
  });
  assert.ok(updated);
  assert.strictEqual(updated.status, 'Graduated');
  assert.strictEqual(updated.isNew, false);
  assert.strictEqual(tenantStore.getStudents('sch_case_test').length, 1);
});

console.log('\n====================================================');
console.log(`CLIENT RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
}
