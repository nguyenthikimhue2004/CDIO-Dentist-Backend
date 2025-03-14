const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  CustomError,
  UnauthorizedError,
} = require("../utils/exception");
const { validationResult } = require("express-validator");
const { validateAddConsultant } = require("../validator/Consultant.validator");
// validation
const {
  validateAdminLogin,
  validateAdminRegistration,
} = require("../validator/Admin.validator");
// import services
// admin services
const {
  getAdminByEmail,
  registerAdmin,
  checkEmailExists,
} = require("../services/Admin.service");
// consultant services
const {
  addConsultant,
  getAllConsultants,
  updateConsultant,
  deleteConsultant,
  getConsultantById,
  checkConsultantEmailExists,
} = require("../services/Consultant.service");
// doctor services
const {
  addDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getAllDoctors,
  checkDoctorEmailExists,
} = require("../services/Doctor.service");

const path = require("path");

exports.registerAdmin = [
  validateAdminRegistration, // Use validation middleware
  async (req, res) => {
    const errors = validationResult(req, res);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }

    let { email, password } = req.body;

    // convert email to lowercase
    email = email.toLowerCase();

    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        throw new BadRequestError("Email này đã được sử dụng");
      }

      await registerAdmin(email, password);
      return res.status(201).json({ message: "Đăng nhập thành công" });
    } catch (error) {
      console.error("Error in registerAdmin:", error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "lỗi máy chủ nội bộ" });
    }
  },
];

// login admin
exports.loginAdmin = [
  validateAdminLogin, // Use validation middleware
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }

    let { email, password } = req.body;

    // convert email to lowercase
    email = email.toLowerCase();

    try {
      const [admin] = await getAdminByEmail(email);
      if (!admin) {
        throw new NotFoundError("Email hoặc mật khẩu không đúng");
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        throw new UnauthorizedError("Email hoặc mật khẩu không đúng");
      }

      const { accessToken, refreshToken } = generateToken({
        id: admin.id,
        email: admin.email,
        is_admin: true,
      });

      return res
        .status(200)
        .json({ message: "Đăng nhập thành công", accessToken, refreshToken });
    } catch (error) {
      console.error("Error in loginAdmin:", error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "lỗi máy chủ nội bộ" });
    }
  },
];

// logout admin
exports.logoutAdmin = async (req, res) => {
  try {
    return res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.error("Error in logoutAdmin:", error);
    return res.status(500).json({ message: "lỗi máy chủ nội bộ" });
  }
};

// add Consultant
exports.addConsultant = [
  validateAddConsultant,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }
    try {
      let profileImage = null;
      if (req.file) {
        profileImage = `/img/consultants/${req.file.filename}`;
      }
      if (await checkConsultantEmailExists(req.body.email)) {
        throw new BadRequestError("Email đã tồn tại");
      }
      await addConsultant(req.user.id, {
        ...req.body,
        profile_image: profileImage,
      });
      res.status(201).json({ message: "Thêm nhân viên tư vấn thành công" });
    } catch (error) {
      console.error("error in add consultant: ", error);
      if (error instanceof BadRequestError) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      res.status(500).json({ message: "lỗi máy chủ nội bộ" });
    }
  },
];

// get consultant by id
exports.getConsultantById = async (req, res) => {
  try {
    const consultant = await getConsultantById(req.params.id);

    // Ensure the profile image path is prefixed with "/public"
    if (consultant.profile_image) {
      consultant.profile_image = `${req.protocol}://${req.get("host")}${
        consultant.profile_image
      }`;
    }

    res.status(200).json(consultant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "lỗi máy chủ nội bộ" });
  }
};

// get all Consultants
exports.getAllConsultants = async (req, res) => {
  try {
    const consultants = await getAllConsultants();

    // Ensure all profile image paths are prefixed with "/public"
    consultants.forEach((consultant) => {
      if (consultant.profile_image) {
        consultant.profile_image = `${req.protocol}://${req.get("host")}${
          consultant.profile_image
        }`;
      }
    });

    res.status(200).json(consultants);
  } catch (error) {
    console.error("Error in get all consultants", error);
    res.status(500).json({ message: "lỗi máy chủ nội bộ" });
  }
};

// update information of Consultant
exports.updateConsultant = async (req, res) => {
  try {
    let profileImage = null;
    if (req.file) {
      profileImage = `/img/consultants/${req.file.filename}`;
    }
    await updateConsultant(req.params.id, {
      ...req.body,
      profile_image: profileImage,
    });
    res.status(200).json({ message: "Cập nhật thông tin thành công" });
  } catch (error) {
    console.error("error in update consultant", error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "lỗi máy chủ nội bộ" });
  }
};

// delete Consultant
exports.deleteConsultant = async (req, res) => {
  try {
    await deleteConsultant(req.params.id);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    console.error("error in delete consultant", error);
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: error.message }); // Trả về 404 nếu không tìm thấy
    }
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "lỗi máy chủ nội bộ" });
  }
};

// add Doctor
exports.addDoctor = async (req, res) => {
  try {
    if (await checkDoctorEmailExists(req.body.email)) {
      throw new BadRequestError("Email đã tồn tại");
    }
    let profileImage = null;
    if (req.file) {
      profileImage = `/img/doctors/${req.file.filename}`;
    }
    await addDoctor(req.user.id, { ...req.body, profile_image: profileImage });
    res.status(201).json({ message: "Thêm bác sĩ thành công" });
  } catch (error) {
    console.error("error in add doctor ", error);
    if (error instanceof BadRequestError) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "lỗi máy chủ nội bộ" });
  }
};

// get doctor by id
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await getDoctorById(req.params.id);

    // Ensure the profile image path is prefixed with "/public"
    if (doctor.profile_image) {
      doctor.profile_image = `${req.protocol}://${req.get("host")}${
        doctor.profile_image
      }`;
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "lỗi máy chủ nội bộ" });
  }
};

// get all Doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await getAllDoctors();
    // Ensure all profile image paths are prefixed with "/public"
    doctors.forEach((doctor) => {
      if (doctor.profile_image) {
        doctor.profile_image = `${req.protocol}://${req.get("host")}${
          doctor.profile_image
        }`;
      }
    });

    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error in get all doctors", error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "lỗi máy chủ nội bộ" });
  }
};

// update information of Doctor
exports.updateDoctor = async (req, res) => {
  try {
    const doctorID = req.params.id;
    let profileImage = null;
    if (req.file) {
      profileImage = `/img/doctors/${req.file.filename}`;
    }
    await updateDoctor(doctorID, { ...req.body, profile_image: profileImage });
    res.status(200).json({ message: "Cập nhật thông tin thành công" });
  } catch (error) {
    console.error("error in update doctor", error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "lỗi máy chủ nội bộ" });
  }
};

// delete Doctor
exports.deleteDoctor = async (req, res) => {
  try {
    await deleteDoctor(req.params.id);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    console.error("error in delete doctor", error);
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: error.message }); // Trả về 404 nếu không tìm thấy
    }
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "lỗi máy chủ nội bộ" });
  }
};
