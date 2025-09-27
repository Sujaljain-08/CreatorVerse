import 'dotenv/config'
import mongoose from "mongoose"
import { User } from "./models/user.model.js"
import { Video } from "./models/video.model.js"
import { Subscriber } from "./models/subscriber.model.js"
import { Comment } from "./models/comment.model.js"
import { Like } from "./models/like.model.js"
// Import other models as needed

// Comprehensive Mock Data Generation Script
async function generateAllMockData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(`${process.env.DATABASE_URI}/${process.env.DB_NAME}`);
        console.log("📦 Connected to MongoDB");

        // Clear existing data (uncomment if you want fresh data)
        await clearAllData();

        // Generate all data in proper order (respecting dependencies)
        const users = await generateUsers();
        console.log(`👥 Created ${users.length} users`);

        const videos = await generateVideos(users);
        console.log(`🎥 Created ${videos.length} videos`);

        const subscribers = await generateSubscribers(users);
        console.log(`🔔 Created ${subscribers.length} subscriptions`);

        const comments = await generateComments(users, videos);
        console.log(`💬 Created ${comments.length} comments`);

        const likes = await generateLikes(users, videos);
        console.log(`👍 Created ${likes.length} likes`);

        const playlists = await generatePlaylists(users, videos);
        console.log(`📋 Created ${playlists.length} playlists`);

        // Update watch history
        await updateWatchHistory(users, videos);
        console.log("📺 Updated watch history");

        // Update video like counts based on actual likes
        await updateVideoLikeCounts(videos);
        console.log("🔢 Updated video like counts");

        console.log("✅ All mock data generation completed!");

    } catch (error) {
        console.error("❌ Error generating mock data:", error);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 MongoDB connection closed");
    }
}

// Clear all existing data
async function clearAllData() {
    await User.deleteMany({});
    await Video.deleteMany({});
    await Subscriber.deleteMany({});
    await Comment.deleteMany({});
    await Like.deleteMany({});
    // await Playlist.deleteMany({});
    console.log("🧹 Cleared all existing data");
}

// Generate Users
async function generateUsers() {
    const userData = [
        {
            fullName: "Alex Johnson",
            username: "alextech",
            email: "alex@example.com",
            Password: "password123",
            avatar: "https://res.cloudinary.com/demo/image/upload/avatars/alex.jpg",
            coverImage: "https://res.cloudinary.com/demo/image/upload/covers/alex-cover.jpg"
        },
        {
            fullName: "Sarah Chen",
            username: "sarahcodes",
            email: "sarah@example.com",
            Password: "password123",
            avatar: "https://res.cloudinary.com/demo/image/upload/avatars/sarah.jpg",
            coverImage: "https://res.cloudinary.com/demo/image/upload/covers/sarah-cover.jpg"
        },
        {
            fullName: "Mike Rodriguez",
            username: "mikemusic",
            email: "mike@example.com",
            Password: "password123",
            avatar: "https://res.cloudinary.com/demo/image/upload/avatars/mike.jpg",
            coverImage: "https://res.cloudinary.com/demo/image/upload/covers/mike-cover.jpg"
        },
        {
            fullName: "Emma Wilson",
            username: "emmafitness",
            email: "emma@example.com",
            Password: "password123",
            avatar: "https://res.cloudinary.com/demo/image/upload/avatars/emma.jpg",
            coverImage: "https://res.cloudinary.com/demo/image/upload/covers/emma-cover.jpg"
        },
        {
            fullName: "David Kim",
            username: "davidcooking",
            email: "david@example.com",
            Password: "password123",
            avatar: "https://res.cloudinary.com/demo/image/upload/avatars/david.jpg",
            coverImage: "https://res.cloudinary.com/demo/image/upload/covers/david-cover.jpg"
        },
        {
            fullName: "Lisa Thompson",
            username: "lisatravel",
            email: "lisa@example.com",
            Password: "password123",
            avatar: "https://res.cloudinary.com/demo/image/upload/avatars/lisa.jpg",
            coverImage: "https://res.cloudinary.com/demo/image/upload/covers/lisa-cover.jpg"
        },
        {
            fullName: "James Wilson",
            username: "jamesart",
            email: "james@example.com",
            Password: "password123",
            avatar: "https://res.cloudinary.com/demo/image/upload/avatars/james.jpg",
            coverImage: "https://res.cloudinary.com/demo/image/upload/covers/james-cover.jpg"
        },
        {
            fullName: "Maya Patel",
            username: "mayagaming",
            email: "maya@example.com",
            Password: "password123",
            avatar: "https://res.cloudinary.com/demo/image/upload/avatars/maya.jpg",
            coverImage: "https://res.cloudinary.com/demo/image/upload/covers/maya-cover.jpg"
        }
    ];

    // Create users individually to trigger pre-hook for password hashing
    const users = [];
    for (const data of userData) {
        const user = new User(data);
        await user.save(); // This triggers the pre('save') hook
        users.push(user);
    }
    return users;
}

// Generate Videos
async function generateVideos(users) {
    const videoData = [
        // Alex's Tech Videos
        {
            title: "JavaScript Advanced Concepts Explained",
            owner: users[0]._id,
            videoFile: "https://res.cloudinary.com/demo/video/upload/videos/js-advanced.mp4",
            thumbnail: "https://res.cloudinary.com/demo/image/upload/thumbnails/js-advanced.jpg",
            description: "Deep dive into closures, async/await, and modern JavaScript features",
            duration: 1800,
            viewCount: 15420,
            likeCount: 0,
            isPublished: true
        },
        {
            title: "React Hooks Complete Guide",
            owner: users[0]._id,
            videoFile: "https://res.cloudinary.com/demo/video/upload/videos/react-hooks.mp4",
            thumbnail: "https://res.cloudinary.com/demo/image/upload/thumbnails/react-hooks.jpg",
            description: "Master useState, useEffect, useContext and custom hooks",
            duration: 2400,
            viewCount: 23100,
            likeCount: 0,
            isPublished: true
        },

        // Sarah's AI/ML Videos
        {
            title: "Python Data Structures and Algorithms",
            owner: users[1]._id,
            videoFile: "https://res.cloudinary.com/demo/video/upload/videos/python-dsa.mp4",
            thumbnail: "https://res.cloudinary.com/demo/image/upload/thumbnails/python-dsa.jpg",
            description: "Essential DSA concepts for coding interviews",
            duration: 3600,
            viewCount: 45200,
            likeCount: 0,
            isPublished: true
        },
        {
            title: "Machine Learning with TensorFlow",
            owner: users[1]._id,
            videoFile: "https://res.cloudinary.com/demo/video/upload/videos/ml-tensorflow.mp4",
            thumbnail: "https://res.cloudinary.com/demo/image/upload/thumbnails/ml-tensorflow.jpg",
            description: "Build your first neural network from scratch",
            duration: 2700,
            viewCount: 18900,
            likeCount: 0,
            isPublished: true
        },

        // Mike's Music Videos
        {
            title: "Guitar Techniques for Beginners",
            owner: users[2]._id,
            videoFile: "https://res.cloudinary.com/demo/video/upload/videos/guitar-basics.mp4",
            thumbnail: "https://res.cloudinary.com/demo/image/upload/thumbnails/guitar-basics.jpg",
            description: "Learn essential chord progressions and strumming patterns",
            duration: 1500,
            viewCount: 12800,
            likeCount: 0,
            isPublished: true
        },
        {
            title: "Music Production in Logic Pro X",
            owner: users[2]._id,
            videoFile: "https://res.cloudinary.com/demo/video/upload/videos/logic-pro.mp4",
            thumbnail: "https://res.cloudinary.com/demo/image/upload/thumbnails/logic-pro.jpg",
            description: "Complete guide to recording and mixing your tracks",
            duration: 4200,
            viewCount: 31500,
            likeCount: 0,
            isPublished: true
        },

        // Emma's Fitness Videos
        {
            title: "30-Minute Full Body HIIT Workout",
            owner: users[3]._id,
            videoFile: "https://res.cloudinary.com/demo/video/upload/videos/hiit-workout.mp4",
            thumbnail: "https://res.cloudinary.com/demo/image/upload/thumbnails/hiit-workout.jpg",
            description: "No equipment needed! Burn calories and build strength",
            duration: 1800,
            viewCount: 89200,
            likeCount: 0,
            isPublished: true
        },
        {
            title: "Yoga for Stress Relief",
            owner: users[3]._id,
            videoFile: "https://res.cloudinary.com/demo/video/upload/videos/yoga-stress.mp4",
            thumbnail: "https://res.cloudinary.com/demo/image/upload/thumbnails/yoga-stress.jpg",
            description: "Gentle yoga flow to help you unwind and relax",
            duration: 2100,
            viewCount: 54300,
            likeCount: 0,
            isPublished: true
        },

        // David's Cooking Videos
        {
            title: "Perfect Homemade Pizza Dough",
            owner: users[4]._id,
            videoFile: "https://res.cloudinary.com/demo/video/upload/videos/pizza-dough.mp4",
            thumbnail: "https://res.cloudinary.com/demo/image/upload/thumbnails/pizza-dough.jpg",
            description: "Step-by-step guide to making restaurant-quality pizza at home",
            duration: 1200,
            viewCount: 76400,
            likeCount: 0,
            isPublished: true
        },
        {
            title: "5-Ingredient Pasta Recipes",
            owner: users[4]._id,
            videoFile: "https://res.cloudinary.com/demo/video/upload/videos/pasta-recipes.mp4",
            thumbnail: "https://res.cloudinary.com/demo/image/upload/thumbnails/pasta-recipes.jpg",
            description: "Quick and delicious pasta dishes for busy weeknights",
            duration: 900,
            viewCount: 42100,
            likeCount: 0,
            isPublished: true
        },

        // Lisa's Travel Videos
        {
            title: "Budget Travel Tips for Europe",
            owner: users[5]._id,
            videoFile: "https://res.cloudinary.com/demo/video/upload/videos/europe-budget.mp4",
            thumbnail: "https://res.cloudinary.com/demo/image/upload/thumbnails/europe-budget.jpg",
            description: "How to travel Europe on $50 a day",
            duration: 2200,
            viewCount: 95600,
            likeCount: 0,
            isPublished: true
        },
        {
            title: "Hidden Gems in Tokyo",
            owner: users[5]._id,
            videoFile: "https://res.cloudinary.com/demo/video/upload/videos/tokyo-gems.mp4",
            thumbnail: "https://res.cloudinary.com/demo/image/upload/thumbnails/tokyo-gems.jpg",
            description: "Discover Tokyo's best kept secrets beyond the tourist spots",
            duration: 1680,
            viewCount: 67800,
            likeCount: 0,
            isPublished: true
        },

        // James' Art Videos
        {
            title: "Digital Art Fundamentals",
            owner: users[6]._id,
            videoFile: "https://res.cloudinary.com/demo/video/upload/videos/digital-art.mp4",
            thumbnail: "https://res.cloudinary.com/demo/image/upload/thumbnails/digital-art.jpg",
            description: "Learn the basics of digital painting and illustration",
            duration: 2800,
            viewCount: 34200,
            likeCount: 0,
            isPublished: true
        },

        // Maya's Gaming Videos
        {
            title: "Top 10 Indie Games of 2024",
            owner: users[7]._id,
            videoFile: "https://res.cloudinary.com/demo/video/upload/videos/indie-games.mp4",
            thumbnail: "https://res.cloudinary.com/demo/image/upload/thumbnails/indie-games.jpg",
            description: "Discover amazing independent games you might have missed",
            duration: 1920,
            viewCount: 78500,
            likeCount: 0,
            isPublished: true
        }
    ];

    return await Video.insertMany(videoData);
}

// Generate Subscribers
async function generateSubscribers(users) {
    const subscriptions = [
        // Alex subscribes to Sarah, Mike, Emma
        { channel: users[1]._id, subscriber: users[0]._id },
        { channel: users[2]._id, subscriber: users[0]._id },
        { channel: users[3]._id, subscriber: users[0]._id },

        // Sarah subscribes to Alex, David, Lisa
        { channel: users[0]._id, subscriber: users[1]._id },
        { channel: users[4]._id, subscriber: users[1]._id },
        { channel: users[5]._id, subscriber: users[1]._id },

        // Mike subscribes to Alex, Emma, James
        { channel: users[0]._id, subscriber: users[2]._id },
        { channel: users[3]._id, subscriber: users[2]._id },
        { channel: users[6]._id, subscriber: users[2]._id },

        // Emma subscribes to Sarah, Mike, Maya
        { channel: users[1]._id, subscriber: users[3]._id },
        { channel: users[2]._id, subscriber: users[3]._id },
        { channel: users[7]._id, subscriber: users[3]._id },

        // David subscribes to Alex, Emma, Lisa
        { channel: users[0]._id, subscriber: users[4]._id },
        { channel: users[3]._id, subscriber: users[4]._id },
        { channel: users[5]._id, subscriber: users[4]._id },

        // Lisa subscribes to Sarah, David, James, Maya
        { channel: users[1]._id, subscriber: users[5]._id },
        { channel: users[4]._id, subscriber: users[5]._id },
        { channel: users[6]._id, subscriber: users[5]._id },
        { channel: users[7]._id, subscriber: users[5]._id },

        // James subscribes to Alex, Mike, Maya
        { channel: users[0]._id, subscriber: users[6]._id },
        { channel: users[2]._id, subscriber: users[6]._id },
        { channel: users[7]._id, subscriber: users[6]._id },

        // Maya subscribes to everyone except herself
        { channel: users[0]._id, subscriber: users[7]._id },
        { channel: users[1]._id, subscriber: users[7]._id },
        { channel: users[2]._id, subscriber: users[7]._id },
        { channel: users[3]._id, subscriber: users[7]._id },
        { channel: users[4]._id, subscriber: users[7]._id },
        { channel: users[5]._id, subscriber: users[7]._id },
        { channel: users[6]._id, subscriber: users[7]._id }
    ];

    return await Subscriber.insertMany(subscriptions);
}

// Generate Comments
async function generateComments(users, videos) {
    const comments = [
        // Comments on Alex's JavaScript video
        {
            content: "Great explanation! Finally understood closures properly.",
            owner: users[1]._id,
            channel: users[0]._id
        },
        {
            content: "This helped me so much with my coding interview prep!",
            owner: users[2]._id,
            channel: users[0]._id
        },

        // Comments on Sarah's Python video
        {
            content: "Best DSA tutorial I've watched. Very clear examples.",
            owner: users[0]._id,
            channel: users[1]._id
        },
        {
            content: "Could you do a video on graph algorithms next?",
            owner: users[3]._id,
            channel: users[1]._id
        },

        // Comments on Emma's workout video
        {
            content: "Just finished this workout and I'm sweating buckets! Great routine!",
            owner: users[4]._id,
            channel: users[3]._id
        },
        {
            content: "Love your energy! This got me motivated to work out.",
            owner: users[5]._id,
            channel: users[3]._id
        },

        // Comments on David's pizza video
        {
            content: "Made this recipe last night - amazing results!",
            owner: users[6]._id,
            channel: users[4]._id
        },
        {
            content: "My family loved this pizza. Thank you for sharing!",
            owner: users[7]._id,
            channel: users[4]._id
        },

        // Comments on Lisa's travel video
        {
            content: "Your tips saved me so much money on my Europe trip!",
            owner: users[0]._id,
            channel: users[5]._id
        },
        {
            content: "Planning my trip to Europe now, thanks to your advice!",
            owner: users[3]._id,
            channel: users[5]._id
        }
    ];

    return await Comment.insertMany(comments);
}

// Generate Likes
async function generateLikes(users, videos) {
    const likes = [
        // Likes on Alex's videos
        { channel: users[0]._id, LikedBy: users[1]._id, Video: videos[0]._id },
        { channel: users[0]._id, LikedBy: users[2]._id, Video: videos[0]._id },
        { channel: users[0]._id, LikedBy: users[3]._id, Video: videos[0]._id },
        { channel: users[0]._id, LikedBy: users[4]._id, Video: videos[1]._id },
        { channel: users[0]._id, LikedBy: users[5]._id, Video: videos[1]._id },

        // Likes on Sarah's videos
        { channel: users[1]._id, LikedBy: users[0]._id, Video: videos[2]._id },
        { channel: users[1]._id, LikedBy: users[2]._id, Video: videos[2]._id },
        { channel: users[1]._id, LikedBy: users[3]._id, Video: videos[2]._id },
        { channel: users[1]._id, LikedBy: users[4]._id, Video: videos[2]._id },
        { channel: users[1]._id, LikedBy: users[6]._id, Video: videos[3]._id },

        // Likes on Emma's videos
        { channel: users[3]._id, LikedBy: users[0]._id, Video: videos[6]._id },
        { channel: users[3]._id, LikedBy: users[1]._id, Video: videos[6]._id },
        { channel: users[3]._id, LikedBy: users[2]._id, Video: videos[6]._id },
        { channel: users[3]._id, LikedBy: users[4]._id, Video: videos[6]._id },
        { channel: users[3]._id, LikedBy: users[5]._id, Video: videos[6]._id },
        { channel: users[3]._id, LikedBy: users[7]._id, Video: videos[6]._id },

        // Likes on David's videos
        { channel: users[4]._id, LikedBy: users[0]._id, Video: videos[8]._id },
        { channel: users[4]._id, LikedBy: users[1]._id, Video: videos[8]._id },
        { channel: users[4]._id, LikedBy: users[3]._id, Video: videos[8]._id },
        { channel: users[4]._id, LikedBy: users[5]._id, Video: videos[8]._id },

        // Likes on Lisa's videos
        { channel: users[5]._id, LikedBy: users[0]._id, Video: videos[10]._id },
        { channel: users[5]._id, LikedBy: users[2]._id, Video: videos[10]._id },
        { channel: users[5]._id, LikedBy: users[3]._id, Video: videos[10]._id },
        { channel: users[5]._id, LikedBy: users[7]._id, Video: videos[11]._id }
    ];

    return await Like.insertMany(likes);
}

// Generate Playlists
async function generatePlaylists(users, videos) {
    const playlists = [
        {
            owner: users[0]._id,
            name: "Web Development Essentials",
            description: "Must-watch videos for web developers",
            videos: [videos[0]._id, videos[1]._id, videos[2]._id]
        },
        {
            owner: users[1]._id,
            name: "AI/ML Learning Path",
            description: "Complete machine learning journey",
            videos: [videos[2]._id, videos[3]._id]
        },
        {
            owner: users[3]._id,
            name: "Home Workout Collection",
            description: "Stay fit from home with these workouts",
            videos: [videos[6]._id, videos[7]._id]
        },
        {
            owner: users[5]._id,
            name: "Travel Planning",
            description: "Everything you need for your next adventure",
            videos: [videos[10]._id, videos[11]._id]
        }
    ];

    // Only create playlists if Playlist model is properly defined
    // return await Playlist.insertMany(playlists);
    console.log("Playlist data ready (uncomment when model is fixed)");
    return playlists;
}

// Update Watch History
async function updateWatchHistory(users, videos) {
    const watchHistoryUpdates = [
        // Alex watches AI, music, fitness
        { user: users[0]._id, videos: [videos[2]._id, videos[4]._id, videos[6]._id, videos[8]._id] },
        
        // Sarah watches tech, cooking, travel
        { user: users[1]._id, videos: [videos[0]._id, videos[1]._id, videos[8]._id, videos[10]._id] },
        
        // Mike watches tech, fitness, art
        { user: users[2]._id, videos: [videos[0]._id, videos[6]._id, videos[7]._id, videos[12]._id] },
        
        // Emma watches AI, music, travel
        { user: users[3]._id, videos: [videos[2]._id, videos[3]._id, videos[5]._id, videos[10]._id] },
        
        // David watches tech, fitness, gaming
        { user: users[4]._id, videos: [videos[1]._id, videos[2]._id, videos[6]._id, videos[13]._id] },
        
        // Lisa watches everything
        { user: users[5]._id, videos: [videos[0]._id, videos[2]._id, videos[4]._id, videos[6]._id, videos[8]._id] },
        
        // James watches tech, music, travel
        { user: users[6]._id, videos: [videos[0]._id, videos[4]._id, videos[5]._id, videos[11]._id] },
        
        // Maya watches tech, fitness, art
        { user: users[7]._id, videos: [videos[1]._id, videos[6]._id, videos[7]._id, videos[12]._id] }
    ];

    for (const update of watchHistoryUpdates) {
        await User.findByIdAndUpdate(update.user, {
            $push: { watchHistory: { $each: update.videos } }
        });
    }
}

// Update Video Like Counts
async function updateVideoLikeCounts(videos) {
    for (const video of videos) {
        const likeCount = await Like.countDocuments({ Video: video._id });
        await Video.findByIdAndUpdate(video._id, { likeCount });
    }
}

// Run the comprehensive mock data generation
generateAllMockData();