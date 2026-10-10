import { uploadToImageKit } from '../../core/utils/imagekitService.js';
import prisma from '../../config/db.js';

let schoolProfileStore = {
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
  pinCode: "302026",
  receiptNotes: "Fees once paid is non-refundable. Please keep this computerized receipt for tax purposes.",
  logoUrl: "https://schools.uabinfosol.com/assets/img/logo.png"
};

/**
 * Get school details
 */
export const getSchoolProfile = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: schoolProfileStore
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update school profile
 */
export const updateSchoolProfile = async (req, res, next) => {
  try {
    schoolProfileStore = {
      ...schoolProfileStore,
      ...req.body
    };

    return res.status(200).json({
      success: true,
      message: 'School profile updated successfully',
      data: schoolProfileStore
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload school logo to ImageKit
 */
export const uploadSchoolLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const fileName = `school_logo_${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
    const result = await uploadToImageKit(req.file.buffer, fileName, 'school_branding');

    schoolProfileStore.logoUrl = result.url;

    return res.status(200).json({
      success: true,
      message: 'School logo uploaded to ImageKit',
      data: result
    });
  } catch (error) {
    next(error);
  }
};
