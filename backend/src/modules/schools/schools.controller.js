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
    logoUrl: "https://temp.erichost.app/assets/schools/jdisjr_221/school/1_school_photo_1766831297_f7516d5fc58b9af84fb1.jpg",
    brandingImages: {
      school_logo: "https://temp.erichost.app/assets/schools/jdisjr_221/school/1_school_photo_1766831297_f7516d5fc58b9af84fb1.jpg",
      principal_sig: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDAgNzAiIHdpZHRoPSIyNDAiIGhlaWdodD0iNzAiPgogIDxwYXRoIGQ9Ik0gMjUsNTIgUSA0MCwxNSA1MCwzNSBRIDYwLDU1IDc1LDIyIFEgODUsNDUgMTAwLDI4IFEgMTE1LDEyIDEzNSwzOCBRIDE1MCw1MiAxNjUsMTggUSAxODAsNDUgMjA1LDIyIFEgMjIwLDEyIDIzMCwyOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMGYyYjVjIiBzdHJva2Utd2lkdGg9IjIuNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTSAyMCw0NiBRIDY1LDM4IDEyNSw0MiBRIDE4NSw0NiAyMjUsNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzBmMmI1YyIgc3Ryb2tlLXdpZHRoPSIxLjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDx0ZXh0IHg9IjMyIiB5PSIzOCIgZm9udC1mYW1pbHk9IidCcnVzaCBTY3JpcHQgTVQnLCAnU2Vnb2UgU2NyaXB0JywgY3Vyc2l2ZSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMwZjJiNWMiIGZvbnQtc3R5bGU9Iml0YWxpYyI+QWJoaWxhc2hhPC90ZXh0Pgo8L3N2Zz4=",
      school_stamp: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWUzYThhIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1kYXNoYXJyYXk9IjMsMyIvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iOTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFlM2E4YSIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI2NCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWUzYThhIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cGF0aCBpZD0idFRvcCIgZD0iTSAyNCwxMDAgQSA3Niw3NiAwIDEsMSAxNzYsMTAwIiBmaWxsPSJub25lIi8+CiAgPHBhdGggaWQ9InRCb3R0b20iIGQ9Ik0gMTc2LDEwMCBBIDc2LDc2IDAgMCwxIDI0LDEwMCIgZmlsbD0ibm9uZSIvPgogIDx0ZXh0IGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMSIgZm9udC13ZWlnaHQ9IjkwMCIgZmlsbD0iIzFlM2E4YSIgbGV0dGVyLXNwYWNpbmc9IjEuNSI+CiAgICA8dGV4dFBhdGggaHJlZj0iI3RUb3AiIHN0YXJ0T2Zmc2V0PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuKYhSBKIEQgSU5URVJOQVRJT05BTCBTQ0hPT0wg4piFPC90ZXh0UGF0aD4KICA8L3RleHQ+CiAgPHRleHQgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iODAwIiBmaWxsPSIjMWUzYThhIiBsZXR0ZXItc3BhY2luZz0iMS41Ij4KICAgIDx0ZXh0UGF0aCBocmVmPSIjdEJvdHRvbSIgc3RhcnRPZmZzZXQ9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4piFIEpBSVBVUiAoUkFKLikg4piFPC90ZXh0UGF0aD4KICA8L3RleHQ+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAwLCAxMDApIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4KICAgIDx0ZXh0IHk9Ii0yMiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjguNSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMxZTNhOGEiPkFGRklMSUFURUQgVE8gQ0JTRTwvdGV4dD4KICAgIDx0ZXh0IHk9Ii00IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjIiPvCfjpM8L3RleHQ+CiAgICA8dGV4dCB5PSIxNCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSIjMWUzYThhIiBsZXR0ZXItc3BhY2luZz0iMSI+T0ZGSUNJQUw8L3RleHQ+CiAgICA8dGV4dCB5PSIyNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjguNSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMxZTNhOGEiIGxldHRlci1zcGFjaW5nPSIxIj5TRUFMPC90ZXh0PgogIDwvZz4KPC9zdmc+"
    },
    extraData: {
      affiliationBoard: "CBSE",
      category: "K-12",
      medium: "English Medium",
      schoolType: "Co-Educational",
      estYear: "2015",
      brandingImages: {
        principal_sig: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDAgNzAiIHdpZHRoPSIyNDAiIGhlaWdodD0iNzAiPgogIDxwYXRoIGQ9Ik0gMjUsNTIgUSA0MCwxNSA1MCwzNSBRIDYwLDU1IDc1LDIyIFEgODUsNDUgMTAwLDI4IFEgMTE1LDEyIDEzNSwzOCBRIDE1MCw1MiAxNjUsMTggUSAxODAsNDUgMjA1LDIyIFEgMjIwLDEyIDIzMCwyOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMGYyYjVjIiBzdHJva2Utd2lkdGg9IjIuNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTSAyMCw0NiBRIDY1LDM4IDEyNSw0MiBRIDE4NSw0NiAyMjUsNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzBmMmI1YyIgc3Ryb2tlLXdpZHRoPSIxLjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDx0ZXh0IHg9IjMyIiB5PSIzOCIgZm9udC1mYW1pbHk9IidCcnVzaCBTY3JpcHQgTVQnLCAnU2Vnb2UgU2NyaXB0JywgY3Vyc2l2ZSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMwZjJiNWMiIGZvbnQtc3R5bGU9Iml0YWxpYyI+QWJoaWxhc2hhPC90ZXh0Pgo8L3N2Zz4=",
        school_stamp: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWUzYThhIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1kYXNoYXJyYXk9IjMsMyIvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iOTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFlM2E4YSIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI2NCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWUzYThhIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cGF0aCBpZD0idFRvcCIgZD0iTSAyNCwxMDAgQSA3Niw3NiAwIDEsMSAxNzYsMTAwIiBmaWxsPSJub25lIi8+CiAgPHBhdGggaWQ9InRCb3R0b20iIGQ9Ik0gMTc2LDEwMCBBIDc2LDc2IDAgMCwxIDI0LDEwMCIgZmlsbD0ibm9uZSIvPgogIDx0ZXh0IGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMSIgZm9udC13ZWlnaHQ9IjkwMCIgZmlsbD0iIzFlM2E4YSIgbGV0dGVyLXNwYWNpbmc9IjEuNSI+CiAgICA8dGV4dFBhdGggaHJlZj0iI3RUb3AiIHN0YXJ0T2Zmc2V0PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuKYhSBKIEQgSU5URVJOQVRJT05BTCBTQ0hPT0wg4piFPC90ZXh0UGF0aD4KICA8L3RleHQ+CiAgPHRleHQgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iODAwIiBmaWxsPSIjMWUzYThhIiBsZXR0ZXItc3BhY2luZz0iMS41Ij4KICAgIDx0ZXh0UGF0aCBocmVmPSIjdEJvdHRvbSIgc3RhcnRPZmZzZXQ9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4piFIEpBSVBVUiAoUkFKLikg4piFPC90ZXh0UGF0aD4KICA8L3RleHQ+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAwLCAxMDApIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4KICAgIDx0ZXh0IHk9Ii0yMiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjguNSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMxZTNhOGEiPkFGRklMSUFURUQgVE8gQ0JTRTwvdGV4dD4KICAgIDx0ZXh0IHk9Ii00IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjIiPvCfjpM8L3RleHQ+CiAgICA8dGV4dCB5PSIxNCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSIjMWUzYThhIiBsZXR0ZXItc3BhY2luZz0iMSI+T0ZGSUNJQUw8L3RleHQ+CiAgICA8dGV4dCB5PSIyNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjguNSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMxZTNhOGEiIGxldHRlci1zcGFjaW5nPSIxIj5TRUFMPC90ZXh0PgogIDwvZz4KPC9zdmc+"
      }
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
        responseData = {
          ...dbSchool,
          ...extra,
          brandingImages: TENANT_SCHOOL_PROFILES[schoolId]?.brandingImages || extra.brandingImages || {}
        };
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
      const dbSchool = await prisma.school.findUnique({ where: { id: schoolId } });
      const currentExtra = (dbSchool?.extraData && typeof dbSchool.extraData === 'object') ? dbSchool.extraData : {};
      const updatedExtra = {
        ...currentExtra,
        ...(payload.brandingImages ? { brandingImages: payload.brandingImages } : {})
      };

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
          logoUrl: payload.logoUrl,
          extraData: updatedExtra
        },
        create: {
          id: schoolId,
          schoolName: payload.schoolName || 'School Name',
          schoolCode: payload.schoolCode || 'SCH-CODE',
          phone1: payload.phone1 || '',
          email: payload.email || '',
          extraData: updatedExtra
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
    const slotId = req.body?.slotId || 'school_logo';
    const fileName = `${slotId}_${schoolId}_${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
    const uploadResult = await uploadToImageKit(req.file.buffer, fileName, 'school-logos');

    if (!TENANT_SCHOOL_PROFILES[schoolId]) {
      TENANT_SCHOOL_PROFILES[schoolId] = { id: schoolId };
    }
    if (!TENANT_SCHOOL_PROFILES[schoolId].brandingImages) {
      TENANT_SCHOOL_PROFILES[schoolId].brandingImages = {};
    }
    TENANT_SCHOOL_PROFILES[schoolId].brandingImages[slotId] = uploadResult.url;
    if (slotId === 'school_logo') {
      TENANT_SCHOOL_PROFILES[schoolId].logoUrl = uploadResult.url;
    }

    try {
      const dbSchool = await prisma.school.findUnique({ where: { id: schoolId } });
      if (dbSchool) {
        const extra = (dbSchool.extraData && typeof dbSchool.extraData === 'object') ? dbSchool.extraData : {};
        const brandingImages = { ...(extra.brandingImages || {}), [slotId]: uploadResult.url };
        await prisma.school.update({
          where: { id: schoolId },
          data: {
            ...(slotId === 'school_logo' ? { logoUrl: uploadResult.url } : {}),
            extraData: { ...extra, brandingImages }
          }
        });
      }
    } catch (dbErr) {
      // In-memory fallback
    }

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      slotId,
      data: uploadResult
    });
  } catch (error) {
    next(error);
  }
};
