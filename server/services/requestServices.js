import SupervisorRequest from "../models/supervisorRequest.js";

// ================= CREATE REQUEST =================
export const createRequest = async (requestData) => {
  const { student, supervisor, deadline } = requestData;

  if (!student || !supervisor || !requestData.message || !deadline) {
    throw new ErrorHandler("All fields are required", 400);
  }

  const existingRequest = await SupervisorRequest.findOne({
    student,
    supervisor,
    status: "pending",
  });

  if (existingRequest) {
    throw new ErrorHandler(
      "You already sent a request to this supervisor.",
      400
    );
  }

  // 🔥 FIX: DEFINE parsedDate
  const parsedDate = new Date(deadline);

  if (isNaN(parsedDate)) {
    throw new ErrorHandler("Invalid deadline format", 400);
  }

  const request = await SupervisorRequest.create({
    student,
    supervisor,
    message: requestData.message,
    dueDate: parsedDate, // ✅ NOW WORKS
    status: "pending",
  });

  return request;
};

export const getAllRequests = async (filters) => {
  const requests = await SupervisorRequest.find(filters)
    .populate("student", "name email")
    .populate("supervisor", "name email")
    .sort({ createdAt: -1 });

  const total = await SupervisorRequest.countDocuments(filters);

  return { requests, total };
};

export const acceptRequest = async (requestId, supervisorId) => {
  const request = await SupervisorRequest.findById(requestId)
    .populate("student", "name email supervisor project")
    .populate("supervisor", "name email assignedStudents maxStudents");

  if (!request) throw new Error("Request not found");

  if (request.supervisor._id.toString() !== supervisorId.toString()) {
    throw new Error("Not authorized to accept this request");
  }

  if (request.status !== "pending") {
    throw new Error("Request has already been processed");
  }

  request.status = "accepted";
  await request.save();

  // Link student <-> supervisor
  const User = (await import("../models/user.js")).default;
  const Project = (await import("../models/project.js")).default;

  const studentId = request.student._id;
  const supId = request.supervisor._id;

  // Add student to teacher's assignedStudents (avoid duplicates)
  await User.findByIdAndUpdate(supId, {
    $addToSet: { assignedStudents: studentId },
  });

  // Set student's supervisor field
  await User.findByIdAndUpdate(studentId, { supervisor: supId });

  // Set project supervisor if project exists and has none
  await Project.findOneAndUpdate(
    { student: studentId, supervisor: null },
    { supervisor: supId },
    { sort: { createdAt: -1 } }
  );

  return await SupervisorRequest.findById(request._id)
    .populate("student", "name email supervisor project")
    .populate("supervisor", "name email assignedStudents maxStudents");
};

export const rejectRequest = async (requestId, supervisorId) => {
  const request = await SupervisorRequest.findById(requestId)
    .populate("student", "name email")
    .populate("supervisor", "name email");

  if (!request) throw new Error("Request not found");

  if (request.supervisor._id.toString() !== supervisorId.toString()) {
    throw new Error("Not authorized to reject this request");
  }

  if (request.status !== "pending") {
    throw new Error("Request has already been processed");
  }

  request.status = "rejected";
  await request.save();

  return request;
};