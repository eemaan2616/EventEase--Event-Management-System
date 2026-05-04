const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Event = require('../models/Event');
const Blog = require('../models/Blog');
const Notification = require('../models/Notification');
const Booking = require('../models/Booking');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Event.deleteMany({});
    await Blog.deleteMany({});
    await Notification.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing data');

    const users = await User.create([
      { name: 'Admin User', email: 'admin@eventhub.com', password: 'password123', role: 'admin' },
      { name: 'Sarah Organizer', email: 'organizer@eventhub.com', password: 'password123', role: 'organizer' },
      { name: 'Mike Organizer', email: 'mike@eventhub.com', password: 'password123', role: 'organizer' },
      { name: 'John Attendee', email: 'john@eventhub.com', password: 'password123', role: 'attendee' },
      { name: 'Jane Attendee', email: 'jane@eventhub.com', password: 'password123', role: 'attendee' },
    ]);
    console.log(`Created ${users.length} users`);

    const now = new Date();
    const events = await Event.create([
      {
        title: 'TechConf 2026 - Future of AI',
        description: 'Join us for an incredible conference exploring the future of artificial intelligence, machine learning, and their impact on society. Featuring keynotes from industry leaders, hands-on workshops, and networking opportunities.\n\nTopics include:\n- Large Language Models\n- Computer Vision\n- AI Ethics\n- Autonomous Systems',
        date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
        location: 'Convention Center, San Francisco, CA',
        category: 'conference',
        organizer: users[1]._id,
        status: 'upcoming',
        tickets: [
          { tier: 'General', price: 99, quantity: 200, sold: 0 },
          { tier: 'VIP', price: 249, quantity: 50, sold: 0 },
          { tier: 'Student', price: 49, quantity: 100, sold: 0 },
        ],
      },
      {
        title: 'React Workshop - Build Modern Web Apps',
        description: 'A hands-on workshop where you will learn to build modern, production-ready web applications with React 19, Redux Toolkit, and Tailwind CSS. Perfect for intermediate developers looking to level up.',
        date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        location: 'Tech Hub, Austin, TX',
        category: 'workshop',
        organizer: users[1]._id,
        status: 'upcoming',
        tickets: [
          { tier: 'Standard', price: 79, quantity: 30, sold: 0 },
          { tier: 'Premium (with lunch)', price: 129, quantity: 15, sold: 0 },
        ],
      },
      {
        title: 'Startup Funding Seminar',
        description: 'Learn about different funding stages from seed to Series C. Hear from successful founders and VCs about what it takes to raise capital in today\'s market.',
        date: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
        location: 'Innovation Lab, New York, NY',
        category: 'seminar',
        organizer: users[2]._id,
        status: 'upcoming',
        tickets: [
          { tier: 'General', price: 59, quantity: 100, sold: 0 },
          { tier: 'VIP (includes dinner)', price: 149, quantity: 25, sold: 0 },
        ],
      },
      {
        title: 'Summer Music Festival',
        description: 'An unforgettable 2-day outdoor music festival featuring top artists across multiple genres. Food trucks, art installations, and more!',
        date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000),
        location: 'Central Park, New York, NY',
        category: 'concert',
        organizer: users[2]._id,
        status: 'upcoming',
        tickets: [
          { tier: 'General Admission', price: 75, quantity: 500, sold: 0 },
          { tier: 'VIP', price: 199, quantity: 100, sold: 0 },
          { tier: 'Backstage Pass', price: 399, quantity: 20, sold: 0 },
        ],
      },
      {
        title: 'Cloud Architecture Masterclass',
        description: 'Deep dive into modern cloud architecture patterns using AWS, Azure, and GCP. Learn about microservices, serverless, and container orchestration.',
        date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        location: 'Online (Zoom)',
        category: 'workshop',
        organizer: users[1]._id,
        status: 'upcoming',
        tickets: [
          { tier: 'Standard', price: 149, quantity: 50, sold: 0 },
        ],
      },
      {
        title: 'City Marathon 2026',
        description: 'Annual city marathon with 5K, 10K, half marathon, and full marathon categories. Professional timing, hydration stations, and after-party included.',
        date: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
        location: 'City Stadium, Chicago, IL',
        category: 'sports',
        organizer: users[2]._id,
        status: 'upcoming',
        tickets: [
          { tier: '5K Run', price: 25, quantity: 200, sold: 0 },
          { tier: '10K Run', price: 35, quantity: 150, sold: 0 },
          { tier: 'Half Marathon', price: 50, quantity: 100, sold: 0 },
          { tier: 'Full Marathon', price: 75, quantity: 80, sold: 0 },
        ],
      },
    ]);
    console.log(`Created ${events.length} events`);

    const blogs = await Blog.create([
      {
        title: '10 Tips for Your First Tech Conference',
        content: 'Attending your first tech conference can be overwhelming. Here are our top 10 tips to make the most of your experience:\n\n1. Plan your schedule ahead of time - review the sessions and mark the ones most relevant to you.\n\n2. Bring plenty of business cards - networking is one of the biggest benefits.\n\n3. Wear comfortable shoes - you will be on your feet a lot.\n\n4. Take notes - either digitally or on paper, capture key insights.\n\n5. Engage on social media - use the event hashtag and connect with speakers.\n\n6. Visit the expo hall - many companies showcase their latest products.\n\n7. Attend after-parties - some of the best conversations happen informally.\n\n8. Follow up after the event - connect on LinkedIn with people you met.\n\n9. Share what you learned - write a blog post or present to your team.\n\n10. Take care of yourself - stay hydrated and take breaks when needed.',
        author: users[1]._id,
        tags: ['conference', 'tips', 'networking'],
        published: true,
      },
      {
        title: 'The Future of Remote Events',
        content: 'The pandemic accelerated the shift to virtual events, and many aspects of that shift are here to stay. Hybrid events that combine in-person and virtual experiences are becoming the new standard.\n\nKey trends we are seeing:\n\n- Interactive virtual platforms with networking rooms\n- AI-powered matchmaking for attendees\n- VR/AR experiences for immersive presentations\n- On-demand content libraries for post-event access\n- Carbon footprint reduction through reduced travel\n\nOrganizers who embrace these technologies are seeing higher engagement and broader reach.',
        author: users[2]._id,
        tags: ['remote', 'virtual events', 'technology'],
        published: true,
      },
      {
        title: 'How to Organize a Successful Workshop',
        content: 'Workshops are one of the most engaging formats for learning and collaboration. Here is our guide to organizing a successful one:\n\nDefine clear objectives - What should participants be able to do after the workshop?\n\nKeep groups small - 15-30 participants is ideal for hands-on work.\n\nPrepare materials in advance - Have all supplies, handouts, and digital resources ready.\n\nInclude breaks - A 5-minute break every hour keeps energy levels high.\n\nGather feedback - Use surveys to improve future workshops.',
        author: users[1]._id,
        tags: ['workshop', 'organizing', 'guide'],
        published: true,
      },
    ]);
    console.log(`Created ${blogs.length} blog posts`);

    console.log('\nSeed complete! You can log in with:');
    console.log('Admin:     admin@eventhub.com / password123');
    console.log('Organizer: organizer@eventhub.com / password123');
    console.log('Attendee:  john@eventhub.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
