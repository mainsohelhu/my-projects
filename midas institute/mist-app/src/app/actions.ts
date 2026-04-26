"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";

// --- EMAIL CONFIG ---

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- CRM ACTIONS ---

export async function submitEnquiry(formData: FormData) {
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string || undefined;

  try {
    // Check for duplicates
    const existing = await prisma.enquiry.findFirst({
      where: { OR: [{ phone }, { email: email || "NULL_EMAIL" }] }
    });

    if (existing) {
      return { error: "An application with this phone number or email already exists." };
    }

    const data = {
      name: formData.get("name") as string,
      gender: formData.get("gender") as string || undefined,
      dob: formData.get("dob") as string || undefined,
      phone,
      email,
      cityState: formData.get("cityState") as string || undefined,
      qualification: formData.get("qualification") as string || undefined,
      stream: formData.get("stream") as string || undefined,
      college: formData.get("college") as string || undefined,
      passingYear: formData.get("passingYear") as string || undefined,
      course: formData.get("course") as string,
      mode: formData.get("mode") as string || undefined,
      timing: formData.get("timing") as string || undefined,
      reason: formData.get("reason") as string || undefined,
      goal: formData.get("goal") as string || undefined,
      priorKnowledge: formData.get("priorKnowledge") as string || undefined,
      skills: formData.get("skills") as string || undefined,
      budget: formData.get("budget") as string || undefined,
      startTime: formData.get("startTime") as string || undefined,
      source: formData.get("source") as string || "Website",
      message: formData.get("message") as string || undefined,
      consent: formData.get("consent") === "true",
      signature: formData.get("signature") as string || undefined,
      status: "Lead"
    };

    const lead = await prisma.enquiry.create({ data });
    revalidatePath("/admin");
    return { success: true, id: lead.id };
  } catch (error) {
    console.error("CRM Error:", error);
    return { error: "Failed to log enquiry." };
  }
}

export async function deleteEnquiry(id: string) {
  try {
    await prisma.enquiry.delete({ where: { id } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete lead." };
  }
}

export async function updateEnquiryStatus(id: string, status: string) {
  try {
    await prisma.enquiry.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update status." };
  }
}

// --- STUDENT & ENROLLMENT ACTIONS ---

export async function addStudent(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string || "";
  const address = formData.get("address") as string || "";
  const alternatePhone = formData.get("alternatePhone") as string || "";
  const guardianName = formData.get("guardianName") as string || "";
  
  const courseId = formData.get("courseId") as string;
  const totalFees = parseFloat(formData.get("totalFees") as string || "0");

  if (!name || !phone || !courseId) {
    return { error: "Name, Phone, and Course are mandatory." };
  }

  try {
    // 1. Create or Find Student (by phone)
    let student = await prisma.student.findFirst({ where: { phone } });
    
    if (!student) {
      student = await prisma.student.create({
        data: { name, email, phone, address, alternatePhone, guardianName },
      });
    }

    // 2. Create Enrollment
    await prisma.enrollment.create({
      data: {
        studentId: student.id,
        courseId,
        totalFees,
      }
    });

    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Add Student Error:", error);
    return { error: "Database rejected the enrollment." };
  }
}

export async function addExistingStudentToCourse(studentId: string, formData: FormData) {
  const courseId = formData.get("courseId") as string;
  const totalFees = parseFloat(formData.get("totalFees") as string || "0");

  try {
    await prisma.enrollment.create({
      data: { studentId, courseId, totalFees }
    });
    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    return { error: "Failed to add course." };
  }
}

export async function deleteStudent(id: string) {
  try {
    await prisma.student.delete({ where: { id } });
    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    return { error: "Delete failed." };
  }
}

export async function updateStudent(id: string, formData: FormData) {
  try {
    await prisma.student.update({
      where: { id },
      data: {
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string || undefined,
        address: formData.get("address") as string || undefined,
        alternatePhone: formData.get("alternatePhone") as string || undefined,
        guardianName: formData.get("guardianName") as string || undefined,
        cityState: formData.get("cityState") as string || undefined,
        qualification: formData.get("qualification") as string || undefined,
        stream: formData.get("stream") as string || undefined,
        college: formData.get("college") as string || undefined,
        passingYear: formData.get("passingYear") as string || undefined,
        goal: formData.get("goal") as string || undefined,
        skills: formData.get("skills") as string || undefined,
      },
    });
    revalidatePath("/admin/students");
    return { success: true };
  } catch (error: any) {
    console.error("Update Student Error:", error);
    return { error: "Failed to update student." };
  }
}

// --- BILLING / TRANSACTION ACTIONS ---

export async function addTransaction(formData: FormData) {
  const enrollmentId = formData.get("enrollmentId") as string;
  const amount = parseFloat(formData.get("amount") as string || "0");
  const method = formData.get("method") as string;
  const note = formData.get("note") as string;
  const receiptNumber = `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  if (!enrollmentId || amount <= 0 || !method) {
    return { error: "Invalid payment data." };
  }

  try {
    // 1. Check for overpayment
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId }
    });

    if (!enrollment) return { error: "Enrollment record not found." };

    const remaining = enrollment.totalFees - enrollment.feesPaid;
    if (amount > remaining) {
      return { 
        error: `Overpayment Alert! Remaining balance is only ₹${remaining}. You cannot pay ₹${amount}.` 
      };
    }

    // 2. Create Transaction
    await prisma.transaction.create({
      data: { enrollmentId, amount, method, receiptNumber, note },
    });

    // 3. Update Enrollment's total fees paid
    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        feesPaid: { increment: amount }
      }
    });

    revalidatePath("/admin/students");
    revalidatePath("/admin/billing");
    return { success: true, receiptNumber };
  } catch (error) {
    console.error("Billing Error:", error);
    return { error: "Failed to record payment." };
  }
}

// --- PLACEMENT ACTIONS ---

export async function addPlacement(formData: FormData) {
  const studentName = formData.get("studentName") as string;
  const company = formData.get("company") as string;
  const role = formData.get("role") as string;
  const package_ = formData.get("package") as string;
  const year = formData.get("year") as string || "2026";

  try {
    await prisma.placement.create({
      data: { studentName, company, role, package: package_, year },
    });
    revalidatePath("/admin/placements");
    revalidatePath("/placements");
    return { success: true };
  } catch (error) {
    return { error: "Failed to add story." };
  }
}

export async function deletePlacement(id: string) {
  try {
    await prisma.placement.delete({ where: { id } });
    revalidatePath("/admin/placements");
    revalidatePath("/placements");
    return { success: true };
  } catch (error) {
    return { error: "Delete failed." };
  }
}

// --- EMPLOYEE ACTIONS ---

export async function addEmployee(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;
  const salary = parseFloat(formData.get("salary") as string || "0");

  try {
    await prisma.employee.create({
      data: { name, email, phone, role, salary },
    });
    revalidatePath("/admin/employees");
    return { success: true };
  } catch (error) {
    return { error: "Registration failed." };
  }
}

export async function deleteEmployee(id: string) {
  try {
    await prisma.employee.delete({ where: { id } });
    revalidatePath("/admin/employees");
    return { success: true };
  } catch (error) {
    return { error: "Delete failed." };
  }
}

// --- COURSE ACTIONS ---

export async function addCourse(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const duration = formData.get("duration") as string;
  const price = formData.get("price") as string;
  const showPrice = formData.get("showPrice") === "true";
  const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]/g, "");

  try {
    await prisma.course.create({
      data: { title, description, duration, price, showPrice, slug },
    });
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create program." };
  }
}

export async function editCourse(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const duration = formData.get("duration") as string;
  const price = formData.get("price") as string;
  const showPrice = formData.get("showPrice") === "true";
  const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]/g, "");

  try {
    await prisma.course.update({
      where: { id },
      data: { title, description, duration, price, showPrice, slug },
    });
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { success: true };
  } catch (error: any) {
    console.error("Edit Course Error:", error);
    return { error: `Failed to update program: ${error.message}` };
  }
}

export async function deleteCourse(id: string) {
  try {
    await prisma.course.delete({ where: { id } });
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    return { error: "Delete failed." };
  }
}

// --- TRAINER ACTIONS ---

export async function getTrainers() {
  return prisma.trainer.findMany({ orderBy: { order: "asc" } });
}

export async function addTrainer(formData: FormData) {
  const skillsRaw = formData.get("skills") as string;
  const skills = skillsRaw ? skillsRaw.split(",").map(s => s.trim()).filter(Boolean) : [];
  try {
    await prisma.trainer.create({
      data: {
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        experience: formData.get("experience") as string,
        shortBio: formData.get("shortBio") as string,
        fullBio: formData.get("fullBio") as string,
        photo: formData.get("photo") as string || undefined,
        linkedin: formData.get("linkedin") as string || undefined,
        github: formData.get("github") as string || undefined,
        order: parseInt(formData.get("order") as string || "0"),
        isVisible: formData.get("isVisible") === "true",
        skills,
      },
    });
    revalidatePath("/admin/trainers");
    revalidatePath("/");
    revalidatePath("/trainers");
    return { success: true };
  } catch (error: any) {
    console.error("Add Trainer Error:", error);
    return { error: "Failed to add trainer." };
  }
}

export async function updateTrainer(id: string, formData: FormData) {
  const skillsRaw = formData.get("skills") as string;
  const skills = skillsRaw ? skillsRaw.split(",").map(s => s.trim()).filter(Boolean) : [];
  try {
    await prisma.trainer.update({
      where: { id },
      data: {
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        experience: formData.get("experience") as string,
        shortBio: formData.get("shortBio") as string,
        fullBio: formData.get("fullBio") as string,
        photo: formData.get("photo") as string || undefined,
        linkedin: formData.get("linkedin") as string || undefined,
        github: formData.get("github") as string || undefined,
        order: parseInt(formData.get("order") as string || "0"),
        isVisible: formData.get("isVisible") === "true",
        skills,
      },
    });
    revalidatePath("/admin/trainers");
    revalidatePath("/");
    revalidatePath("/trainers");
    return { success: true };
  } catch (error: any) {
    console.error("Update Trainer Error:", error);
    return { error: "Failed to update trainer." };
  }
}

export async function deleteTrainer(id: string) {
  try {
    await prisma.trainer.delete({ where: { id } });
    revalidatePath("/admin/trainers");
    revalidatePath("/");
    revalidatePath("/trainers");
    return { success: true };
  } catch (error) {
    return { error: "Delete failed." };
  }
}

export async function seedTrainers() {
  const count = await prisma.trainer.count();
  if (count > 0) return { skipped: true };
  await prisma.trainer.createMany({
    data: [
      {
        name: "Surbhi Soni",
        role: "Full Stack Web Developer & Lead Trainer",
        experience: "9+ Years",
        shortBio: "Expert in MERN stack with a passion for building real-world products and mentoring the next generation of developers.",
        fullBio: `Surbhi Soni began her journey in 2015 as a self-taught developer from Raipur. After building over 40 production-grade web applications for clients across India and abroad, she joined MIDAS Institute in 2020 to give back to her community.\n\nShe has trained 300+ students, many of whom now work at companies like TCS, Infosys, and multiple funded startups. Her teaching philosophy is simple: build real things, break them, and understand why.\n\nSurbhi specializes in React.js, Node.js, MongoDB, and cloud deployment on AWS and Vercel. She also conducts industry-connect sessions every month, bringing actual hiring managers to interact with MIDAS students.`,
        photo: "",
        skills: ["React.js", "Node.js", "MongoDB", "AWS", "Next.js", "TypeScript"],
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        order: 1,
        isVisible: true,
      },
      {
        name: "Shabbir Hussain",
        role: "Data Science & AI Specialist",
        experience: "7+ Years",
        shortBio: "Data scientist turned educator, helping students crack AI & ML roles at top tech firms with hands-on project-based learning.",
        fullBio: `Shabbir Hussain holds an M.Tech in Computer Science from NIT Raipur and spent 5 years as a Data Scientist at a Bengaluru-based AI firm before returning to his hometown to teach.\n\nAt MIDAS, he heads the Data Science and AI/ML programs, bringing industry datasets, real Kaggle competitions, and live model deployments into the classroom. His students have won national-level hackathons and secured roles at companies like Amazon, Accenture Analytics, and multiple AI startups.\n\nShabbir's approach is deeply practical: every concept is paired with a real dataset, every model is deployed, and every student walks away with a GitHub portfolio to show recruiters.`,
        photo: "",
        skills: ["Python", "Machine Learning", "TensorFlow", "Pandas", "SQL", "Power BI"],
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        order: 2,
        isVisible: true,
      },
      {
        name: "Fatima Khan",
        role: "UI/UX Design Lead",
        experience: "5+ Years",
        shortBio: "Creative designer focused on building intuitive user experiences and helping students master modern design tools.",
        fullBio: `Fatima Khan is a seasoned UI/UX Designer who has worked with various startups to define their visual identity and user journey. She brings her extensive knowledge of Figma, Adobe XD, and user research to MIDAS.\n\nShe believes that design is not just how it looks, but how it works. Her curriculum covers everything from color theory and typography to advanced prototyping and usability testing. Fatima's goal is to ensure every student can design products that users love.`,
        photo: "",
        skills: ["Figma", "User Research", "Prototyping", "Adobe XD", "Visual Design"],
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        order: 3,
        isVisible: true,
      },
    ],
  });
  revalidatePath("/");
  revalidatePath("/trainers");
  return { success: true };
}

// --- VIDEO ACTIONS ---

export async function addVideo(formData: FormData) {
  try {
    await prisma.video.create({
      data: {
        title: formData.get("title") as string,
        url: formData.get("url") as string,
        thumbnail: formData.get("thumbnail") as string || undefined,
        order: parseInt(formData.get("order") as string || "0"),
        isVisible: formData.get("isVisible") === "true",
      },
    });
    revalidatePath("/admin/videos");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to add video." };
  }
}

export async function deleteVideo(id: string) {
  try {
    await prisma.video.delete({ where: { id } });
    revalidatePath("/admin/videos");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Delete failed." };
  }
}

// --- REVIEW ACTIONS ---

export async function addReview(formData: FormData) {
  try {
    await prisma.review.create({
      data: {
        studentName: formData.get("studentName") as string,
        courseName: formData.get("courseName") as string,
        reviewText: formData.get("reviewText") as string,
        rating: parseInt(formData.get("rating") as string || "5"),
        studentPhoto: formData.get("studentPhoto") as string || undefined,
        order: parseInt(formData.get("order") as string || "0"),
        isVisible: formData.get("isVisible") === "true",
      },
    });
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to add review." };
  }
}

export async function deleteReview(id: string) {
  try {
    await prisma.review.delete({ where: { id } });
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Delete failed." };
  }
}


export async function toggleReviewVisibility(id: string, currentStatus: boolean) {
  try {
    await prisma.review.update({
      where: { id },
      data: { isVisible: !currentStatus }
    });
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update review status." };
  }
}

import bcrypt from 'bcryptjs';
import { login as setSession, logout as clearSession } from '@/lib/auth';

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "Email already taken." };

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: 'STUDENT' }
    });

    await setSession({ id: user.id, email: user.email, role: user.role, name: user.name });
    revalidatePath('/');
    return { success: true };
  } catch (e: any) {
    console.error("Registration error:", e);
    return { error: `Registration failed: ${e.message || 'Unknown error'}` };
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: 'User not found' };

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return { error: 'Invalid password' };

    await setSession({ 
      id: user.id, 
      email: user.email, 
      role: user.role, 
      name: user.name,
      studentId: user.studentId,
      permissions: user.permissions 
    });
    
    revalidatePath('/');
    return { success: true };
  } catch (e) {
    return { error: 'Login failed' };
  }
}

export async function logoutUser() {
  await clearSession();
  revalidatePath('/');
  return { success: true };
}

export async function assignStudentId(userId: string, studentId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { studentId }
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: "Failed to assign ID." };
  }
}

export async function updateAdminPermissions(userId: string, permissions: string[], role: "STUDENT" | "ADMIN" | "SUPER_ADMIN") {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { permissions, role }
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update permissions." };
  }
}
import crypto from 'crypto';

export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "If an account exists with this email, a reset code has been sent." }; // Security: don't reveal if email exists

    const token = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiry: expiry }
    });

    await transporter.sendMail({
      from: `"MIST Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Code - MIST",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p style="color: #666; font-size: 16px;">You requested to reset your password for your MIST account. Use the code below to proceed:</p>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #000; margin: 30px 0;">
            ${token}
          </div>
          <p style="color: #999; font-size: 12px;">This code will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Reset Request Error:", error);
    return { error: "Failed to send reset code. Please try again later." };
  }
}

export async function resetPassword(formData: FormData) {
  const email = formData.get('email') as string;
  const token = formData.get('token') as string;
  const newPassword = formData.get('password') as string;

  try {
    const user = await prisma.user.findFirst({
      where: { 
        email,
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }
      }
    });

    if (!user) return { error: "Invalid or expired reset code." };

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to reset password." };
  }
}
export async function addBlogPost(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const image = formData.get("image") as string;
  const author = formData.get("author") as string;
  const category = formData.get("category") as string;
  const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]/g, "");

  try {
    if (id) {
      await prisma.blogPost.update({
        where: { id },
        data: { title, content, image, author, category, slug }
      });
    } else {
      await prisma.blogPost.create({
        data: { title, content, image, author, category, slug }
      });
    }
    revalidatePath("/admin/blogs");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    return { error: "Failed to save article." };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/admin/blogs");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    return { error: "Delete failed." };
  }
}

export async function toggleBlogPublish(id: string, current: boolean) {
  try {
    await prisma.blogPost.update({
      where: { id },
      data: { published: !current }
    });
    revalidatePath("/admin/blogs");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    return { error: "Update failed." };
  }
}

export async function markAttendance(data: { userId: string, type: string, lat?: number, lng?: number, deviceInfo?: string }) {
  try {
    await prisma.attendance.create({
      data: {
        userId: data.userId,
        type: data.type,
        lat: data.lat,
        lng: data.lng,
        deviceInfo: data.deviceInfo,
      }
    });
    revalidatePath("/admin/attendance");
    return { success: true };
  } catch (error) {
    return { error: "Failed to log attendance." };
  }
}
export async function submitLearningLog(data: { userId: string, content: string, signature?: string }) {
  try {
    await prisma.learningLog.create({
      data: {
        userId: data.userId,
        content: data.content,
        signature: data.signature
      }
    });
    revalidatePath("/admin/learning-logs");
    return { success: true };
  } catch (error) {
    return { error: "Failed to save learning log." };
  }
}
