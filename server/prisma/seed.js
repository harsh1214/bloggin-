import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    // USERS
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("password123", salt);

    const user1 = await prisma.user.create({
        data: { name: "Sam Miller", email: "sam@example.com", password }
    });

    const user2 = await prisma.user.create({
        data: { name: "John Doe", email: "john@example.com", password }
    });

    // CATEGORIES
    const categoryNames = [
        "Technology",
        "Business & Startups",
        "Finance",
        "Health & Wellness",
        "Lifestyle",
        "Education",
        "Self Improvement",
        "Productivity",
        "Relationships",
        "Travel",
        "Food & Cooking",
        "Entertainment",
        "Movies & TV",
        "Music",
        "Sports",
        "Science",
        "Environment",
        "Politics",
        "Society & Culture",
        "Philosophy",
        "History",
        "Writing & Blogging",
        "Design",
        "Art & Creativity",
        "Fashion",
        "Default"
    ];

    await prisma.category.createMany({
        data: categoryNames.map(name => ({ name })),
        skipDuplicates: true
    });

    const categories = await prisma.category.findMany();

    const catMap = Object.fromEntries(
        categories.map(c => [c.name, c.id])
    );

    // BLOGS DATA (20 BLOGS)
    const blogsData = [
        {
            title: "The Rise of Modern Technology",
            isHidden: false,
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
            categories: ["Technology", "Science"],
            content: `<p>Technology has rapidly evolved over the past decade, transforming how people communicate, work, and live. From smartphones to artificial intelligence, innovation continues to shape modern society and redefine human interaction.</p><p>The most significant impact of technology is seen in communication. Social media, messaging platforms, and remote collaboration tools have made global connectivity effortless and instant.</p><p>Technology today is not just about convenience but about transformation at scale. The rapid advancement of artificial intelligence, cloud computing, and automation is reshaping industries and redefining how businesses operate. Companies can now scale globally without heavy infrastructure, while individuals have access to tools that were once limited to large organizations. At the same time, this growth introduces serious concerns such as data privacy, cybersecurity threats, and dependency on digital systems. The balance between innovation and responsibility has become more critical than ever. Ethical considerations are now a central part of technological development, as decisions made today will impact future generations. Emerging technologies like quantum computing and biotechnology promise even greater disruption, pushing the boundaries of what is possible.</p><p>Ultimately, technology is a powerful force that can drive progress when used responsibly. The future depends on how well society adapts to and regulates these advancements.</p>`,
        },
        {
            title: "Building a Startup from Scratch",
            isHidden: false,
            image: "https://images.unsplash.com/photo-1556761175-4b46a572b786",
            categories: ["Business & Startups", "Productivity"],
            content: `<p>Starting a startup begins with identifying a real problem that needs solving. Many founders fail because they focus on ideas rather than understanding actual market needs.</p><p>In the early stages, uncertainty is constant. Founders must handle multiple roles, from product development to marketing and operations, while navigating limited resources.</p><p>Building a startup is a journey that requires resilience, adaptability, and strategic thinking. The process involves validating ideas, understanding customers, and continuously improving the product based on feedback. Execution plays a more important role than ideas, as even great concepts can fail without proper implementation. Funding is another major challenge, requiring careful planning and financial discipline. Startups often face intense competition and must differentiate themselves through innovation and value creation. Hiring the right team is equally important, as a strong group can overcome challenges and accelerate growth. As the business expands, scaling operations efficiently becomes critical, requiring systems, processes, and infrastructure to evolve.</p><p>Ultimately, startups succeed through persistence, learning from failures, and continuously adapting to changing market conditions.</p>`,
        },
        {
            title: "Understanding Personal Finance",
            isHidden: false,
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
            categories: ["Finance", "Self Improvement"],
            content: `<p>Personal finance is essential for achieving financial stability and independence. It involves managing income, expenses, savings, and investments effectively.</p><p>Budgeting is the first step in gaining control over finances. Tracking expenses helps identify unnecessary spending and allows better allocation of resources.</p><p>Personal finance is not just about saving money but about making informed decisions that lead to long-term financial security. Building an emergency fund ensures protection during unexpected situations, while investing allows money to grow over time. Understanding concepts like compound interest, diversification, and risk management can significantly impact wealth creation. Debt management is equally important, as high-interest liabilities can quickly become overwhelming. Financial discipline and consistency play a crucial role, as small, regular contributions often yield better results than irregular large investments. With the right approach, individuals can build sustainable financial habits that support their long-term goals.</p><p>In the end, financial success is determined not by how much you earn but by how effectively you manage and grow your money.</p>`,
        },
        {
            title: "Healthy Living in a Busy World",
            isHidden: false,
            image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
            categories: ["Health & Wellness", "Lifestyle"],
            content: `<p>Maintaining a healthy lifestyle is challenging in a fast-paced world where work and responsibilities dominate daily routines.</p><p>Physical health begins with simple habits like regular exercise and balanced nutrition, which can significantly improve overall well-being.</p><p>Living healthy in a busy world requires intentional choices and consistency. Many people struggle with maintaining routines due to time constraints, but small changes can lead to meaningful improvements. Mental health is equally important, as stress and burnout have become increasingly common. Practices like meditation, mindfulness, and adequate rest can enhance mental clarity and emotional stability. Sleep also plays a crucial role in maintaining energy and productivity, yet it is often neglected. Sustainable habits are more effective than extreme measures, as they can be maintained over time. Technology can also support health through fitness tracking and habit monitoring, helping individuals stay accountable and motivated.</p><p>Ultimately, health is an investment that pays long-term dividends in quality of life and overall happiness.</p>`,
        },
        {
            title: "The Art of Effective Learning",
            isHidden: false,
            image: "https://images.unsplash.com/photo-1513258496099-48168024aec0",
            categories: ["Education", "Productivity"],
            content: `<p>Learning is a continuous process that evolves with time and experience. The ability to learn effectively is more valuable than simply memorizing information.</p><p>Active learning methods such as problem-solving and teaching others improve understanding compared to passive techniques like reading.</p><p>Effective learning requires strategy, consistency, and focus. Techniques such as spaced repetition and active recall help retain information over long periods. Eliminating distractions and creating a dedicated learning environment can significantly improve productivity. Technology has made learning more accessible, with online platforms providing endless resources for skill development. Curiosity plays a vital role in learning, as asking questions and exploring topics deeply enhances comprehension. Consistency is key, as small daily efforts are more effective than occasional intense sessions. By developing strong learning habits, individuals can continuously grow and adapt in a rapidly changing world.</p><p>Ultimately, mastering the art of learning is one of the most valuable skills anyone can develop.</p>`,
        },
        {
            title: "Traveling the World on a Budget",
            isHidden: false,
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            categories: ["Travel", "Lifestyle"],
            content: `<p>Traveling does not always require a large budget. With careful planning, it is possible to explore the world while keeping expenses low.</p><p>Choosing affordable accommodations and using public transportation are some of the most effective ways to reduce travel costs.</p><p>Budget travel is about making smart decisions that maximize experiences while minimizing expenses. Planning ahead, being flexible with travel dates, and exploring alternative destinations can significantly reduce costs. Staying in hostels or local accommodations provides both affordability and cultural exposure. Eating local food instead of dining in expensive restaurants not only saves money but also enhances the travel experience. Traveling during off-seasons offers better deals and fewer crowds. Budget travel often leads to more meaningful experiences, as it encourages interaction with locals and exploration beyond typical tourist spots. It is less about luxury and more about discovery and adventure.</p><p>In the end, traveling on a budget allows more frequent and enriching experiences without financial strain.</p>`,
        },
        {
            title: "The Science Behind Climate Change",
            isHidden: false,
            image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
            categories: ["Science", "Environment"],
            content: `<p>Climate change is one of the most significant global challenges, affecting ecosystems, weather patterns, and human life.</p><p>It is primarily caused by increased greenhouse gas emissions from activities such as burning fossil fuels and deforestation.</p><p>Understanding climate change requires scientific analysis and global cooperation. Rising temperatures, melting ice caps, and extreme weather events are clear indicators of environmental imbalance. Scientific research provides insights into these changes and helps guide policy decisions. Reducing carbon emissions through renewable energy sources is a key step in addressing the issue. Governments and organizations are working toward sustainable solutions, but individual actions also play an important role. Simple lifestyle changes can collectively contribute to reducing environmental impact. The challenge lies in balancing economic growth with environmental sustainability.</p><p>Ultimately, addressing climate change requires collective effort and long-term commitment from individuals, organizations, and governments.</p>`,
        },
        {
            title: "Improving Productivity Daily",
            isHidden: false,
            image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
            categories: ["Productivity", "Self Improvement"],
            content: `<p>Productivity is about focusing on meaningful work rather than simply staying busy. It involves managing time, energy, and attention effectively.</p><p>Setting clear goals helps prioritize tasks and ensures that efforts are aligned with desired outcomes.</p><p>Improving productivity requires discipline, awareness, and the right strategies. Techniques like time blocking and the Pomodoro method help maintain focus and reduce distractions. Managing energy levels through proper sleep, exercise, and nutrition is equally important. Technology can aid productivity through tools and apps, but excessive usage can also become a distraction. Consistency plays a crucial role, as small daily improvements lead to significant long-term results. Self-awareness helps individuals identify their peak performance times and optimize their work accordingly. Productivity is not about doing more but about doing better.</p><p>In the long run, developing productive habits leads to better results, reduced stress, and a more balanced life.</p>`,
        }
    ];

    const randomBetween = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // Create 20 blogs (repeat pattern with variation)
    for (let i = 0; i < 20; i++) {
        const base = blogsData[i % blogsData.length];
        const userId = i % 2 === 0 ? user1.id : user2.id;

        const plainText = base.content.replace(/<[^>]+>/g, " ")
        const excerpt = plainText.split(/\s+/).slice(0, 65).join(" ")

        const blog = await prisma.blogs.create({
            data: {
                title: base.title + " #" + (i + 1),
                content: base.content,
                excerpt,
                userId,
                image: base.image,
                views: randomBetween(100, 999),
                isHidden: base.isHidden,
                categories: {
                    create: base.categories.map(name => ({
                        category: {
                            connect: { id: catMap[name] }
                        }
                    }))
                }
            }
        });

        await prisma.like.create({
            data: {
                userId: userId,
                blogId: blog.id
            }
        });
    }

    console.log("✅ Seeded 20 blogs successfully");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());