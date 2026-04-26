const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data...");

  // Seed Courses
  const courses = [
    {
      title: "Full Stack Web Development",
      slug: "full-stack-web-dev",
      description: "Master the MERN stack (MongoDB, Express, React, Node.js) and build industry-grade applications.",
      duration: "6 Months",
      price: "₹35,000",
    },
    {
      title: "Data Science & Artificial Intelligence",
      slug: "data-science-ai",
      description: "Learn Python, Machine Learning, and Deep Learning to solve complex data problems.",
      duration: "8 Months",
      price: "₹45,000",
    },
    {
      title: "Python Professional Certification",
      slug: "python-professional",
      description: "Master Python from basics to advanced. Ideal for automation, scripting, and backend development.",
      duration: "4 Months",
      price: "₹25,000",
    },

  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: course,
    });
  }

  // Seed Enquiries
  const enquiries = [
    {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "9876543210",
      course: "Full Stack Web Development",
      message: "I am interested in the upcoming batch.",
      status: "Enrolled",
    },
    {
      name: "Priya Singh",
      email: "priya@example.com",
      phone: "8888888888",
      course: "Data Science & AI",
      message: "Do you provide weekend classes?",
      status: "Pending Call",
    },

  ];

  for (const enquiry of enquiries) {
    await prisma.enquiry.create({
      data: enquiry,
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
