import {
    IconShieldCheck,
    IconAward,
    IconScale,
    IconBook,
    IconLock,
    IconUsers,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

const CoreValues = () => {
    const values = [
        {
            title: "Objectivity",
            description:
                "We act solely in the best interest of each client, based on sound analysis and without bias, ensuring their satisfaction.",
            icon: <IconShieldCheck size={48} />,
        },
        {
            title: "Integrity",
            description:
                "We hold ourselves to the highest ethical standards in our dealings with clients, prospects and community members.",
            icon: <IconAward size={48} />,
        },
        {
            title: "Fairness",
            description:
                "We treat all clients fairly and with respect. We believe in equal service and treating clients with dignity and empathy.",
            icon: <IconScale size={48} />,
        },
        {
            title: "Competence",
            description:
                "We continuously improve our professional knowledge and skills.",
            icon: <IconBook size={48} />,
        },
        {
            title: "Confidentiality",
            description:
                "We do not disclose any confidential client information without consent.",
            icon: <IconLock size={48} />,
        },
        {
            title: "Professionalism",
            description:
                "We adhere to the highest professional standards in all our work.",
            icon: <IconUsers size={48} />,
        },
    ];

    return (
        <section id="core-values" className="py-12 bg-gradient-to-br from-secondary/10 to-secondary/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-10">
                    <p className="text-sm font-playfair font-semibold text-tertiary/80 uppercase tracking-[0.15em] mb-4">
                        OUR VALUES
                    </p>
                    <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-tertiary mb-6 leading-tight">
                        Guided by Integrity and Excellence
                    </h2>
                    <div className="flex justify-center">
                        <p className="font-crimson text-lg md:text-xl text-tertiary/80 max-w-4xl leading-relaxed text-center">
                            At Haria Investments, our values guide every interaction with clients,
                            prospects, and the community. They are the foundation of the trust
                            we've built over generations.
                        </p>
                    </div>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {values.map((value, index) => (
                        <motion.div
                            key={value.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center group transition-all duration-300"
                        >
                            {/* Circular Icon Container */}
                            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-tertiary to-tertiary/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border-2 border-tertiary/20">
                                <div className="text-white">
                                    {value.icon}
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="font-playfair text-lg md:text-xl font-bold text-tertiary mb-2 min-h-[2.5rem] flex items-center justify-center">
                                {value.title}
                            </h3>

                            {/* Description */}
                            <p className="font-crimson text-sm md:text-base text-tertiary/70 leading-relaxed text-justify">
                                {value.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoreValues;
