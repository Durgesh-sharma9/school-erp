import { uploadToImageKit } from '../../core/utils/imagekitService.js';
import prisma from '../../config/db.js';

// Multi-Tenant Partitioned School Profiles Store
export const TENANT_SCHOOL_PROFILES = {
  'sch_jd_intl': {
    id: 'sch_jd_intl',
    schoolName: "J D International School",
    schoolCode: "10964",
    udiseNo: "08121204312",
    affiliationNo: "1730619",
    phone1: "8947919195",
    phone2: "9414000000",
    email: "10964@cbseshiksha.in",
    website: "www.jdschooljaipur.com",
    address: "Mahapura, Ajmer Road, Jaipur",
    place: "Jaipur",
    state: "Rajasthan",
    pinCode: "302026",
    receiptNotes: "Fees once paid is non-refundable. Please keep this computerized receipt for tax purposes.",
    logoUrl: "https://schools.uabinfosol.com/assets/img/logo.png",
    extraData: {
      affiliationBoard: "CBSE",
      category: "K-12",
      medium: "English Medium",
      schoolType: "Co-Educational",
      estYear: "2015"
    }
  },
  'sch_dps_branch2': {
    id: 'sch_dps_branch2',
    schoolName: "Delhi Public Academy",
    schoolCode: "DPA-2026",
    udiseNo: "07080911223",
    affiliationNo: "2730119",
    phone1: "9810011223",
    phone2: "9810099887",
    email: "principal@dpsacademy.edu.in",
    website: "www.dpsacademy.edu.in",
    address: "Sector 14, Dwarka, New Delhi",
    place: "New Delhi",
    state: "Delhi",
    pinCode: "110075",
    receiptNotes: "Official computerized fee receipt of Delhi Public Academy.",
    logoUrl: "",
    extraData: {
      affiliationBoard: "CBSE",
      category: "Senior Secondary",
      medium: "English Medium",
      schoolType: "Co-Educational",
      estYear: "2018"
    }
  }
};

const getActiveSchoolId = (req) => {
  return req.schoolId || req.user?.schoolId || req.headers['x-school-id'] || 'sch_jd_intl';
};

/**
 * Get school details strictly for active tenant
 */
export const getSchoolProfile = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    let responseData = TENANT_SCHOOL_PROFILES[schoolId];

    if (!responseData) {
      // Dynamic fallback for newly registered school
      responseData = {
        id: schoolId,
        schoolName: req.user?.schoolName || "Newly Registered School",
        schoolCode: req.user?.schoolCode || "SCH-NEW",
        udiseNo: "",
        affiliationNo: "",
        phone1: req.user?.username || "",
        phone2: "",
        email: req.user?.email || "",
        website: "",
        address: "Campus Address",
        place: "City",
        state: "State",
        pinCode: "000000",
        receiptNotes: "Computer generated receipt.",
        logoUrl: "",
        extraData: {}
      };
      TENANT_SCHOOL_PROFILES[schoolId] = responseData;
    }

    try {
      const dbSchool = await prisma.school.findUnique({
        where: { id: schoolId }
      });
      if (dbSchool) {
        const extra = (dbSchool.extraData && typeof dbSchool.extraData === 'object') ? dbSchool.extraData : {};
        responseData = { ...dbSchool, ...extra };
      }
    } catch (dbErr) {
      // Offline fallback
    }

    return res.status(200).json({
      success: true,
      schoolId,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update school profile strictly for active tenant
 */
export const updateSchoolProfile = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const payload = req.body || {};

    if (!TENANT_SCHOOL_PROFILES[schoolId]) {
      TENANT_SCHOOL_PROFILES[schoolId] = { id: schoolId, ...payload };
    } else {
      TENANT_SCHOOL_PROFILES[schoolId] = {
        ...TENANT_SCHOOL_PROFILES[schoolId],
        ...payload
      };
    }

    try {
      await prisma.school.upsert({
        where: { id: schoolId },
        update: {
          schoolName: payload.schoolName,
          schoolCode: payload.schoolCode,
          udiseNo: payload.udiseNo,
          affiliationNo: payload.affiliationNo,
          address: payload.address,
          place: payload.place,
          pinCode: payload.pinCode,
          phone1: payload.phone1,
          phone2: payload.phone2,
          email: payload.email,
          website: payload.website,
          receiptNotes: payload.receiptNotes,
          logoUrl: payload.logoUrl
        },
        create: {
          id: schoolId,
          schoolName: payload.schoolName || 'School Name',
          schoolCode: payload.schoolCode || 'SCH-CODE',
          phone1: payload.phone1 || '',
          email: payload.email || ''
        }
      });
    } catch (dbErr) {
      // In-memory fallback
    }

    return res.status(200).json({
      success: true,
      message: `School profile updated successfully for tenant ${schoolId}`,
      data: TENANT_SCHOOL_PROFILES[schoolId]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload school logo to ImageKit (Tenant tagged)
 */
export const uploadSchoolLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }
    const schoolId = getActiveSchoolId(req);
    const fileName = `logo_${schoolId}_${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
    const uploadResult = await uploadToImageKit(req.file.buffer, fileName, 'school-logos');

    if (TENANT_SCHOOL_PROFILES[schoolId]) {
      TENANT_SCHOOL_PROFILES[schoolId].logoUrl = uploadResult.url;
    }

    return res.status(200).json({
      success: true,
      message: 'Logo uploaded successfully',
      data: uploadResult
    });
  } catch (error) {
    next(error);
  }
};
