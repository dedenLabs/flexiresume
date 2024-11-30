// ImageViewerContext.tsx
import React, { createContext, useContext, useState } from 'react';
import Modal from './Modal';
import { motion } from 'framer-motion';

type ImageViewerContextType = {
    handleImageClick: (url: string) => void;
};

const ImageViewerContext = createContext<ImageViewerContextType | undefined>(undefined);

export const useImageViewer = () => {
    const context = useContext(ImageViewerContext);
    if (!context) {
        throw new Error('useImageViewer must be used within an ImageViewerProvider');
    }
    return context;
};

export const ImageViewerProvider: React.FC = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const handleImageClick = (url: string) => {
        setSelectedImage(url);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    window.$handleImageClick = handleImageClick;// 为方便 ParseAndReplaceSkills.tsx 中调用这里直接暴露方法
    return (
        <ImageViewerContext.Provider value={{ handleImageClick }}>
            {children}
            {isModalOpen && <motion.div
                initial={{ opacity: 0 }}  // 初始透明
                animate={{ opacity: 1 }}  // 动画过渡到不透明
                exit={{ opacity: 0 }}     // 退出时透明
                transition={{ duration: 0.3 }} // 过渡时间
            >
                <Modal imageUrl={selectedImage} onClose={handleCloseModal} />
            </motion.div>
            }
        </ImageViewerContext.Provider>
    );
};
