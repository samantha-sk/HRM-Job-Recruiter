import Employee from "../../model/employeeSchema.js";

const createEmployee = async (req, res) => {
  try {
    const { username, password, name, phoneNumber } = req.body;

    if (!username || !password || !name || !phoneNumber) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if username or phone number already exists
    const existingEmployee = await Employee.findOne({ $or: [{ username }, { phoneNumber }] });
    if (existingEmployee) {
      return res.status(400).json({ success: false, message: "Username or phone number already exists" });
    }

    const employee = new Employee({ username, password, name, phoneNumber });
    await employee.save();

    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default createEmployee;
