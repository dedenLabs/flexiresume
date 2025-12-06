// ImageViewerContext.tsx
import React, { createContext, useContext, useState } from 'react';
import Modal from './Modal';
import { motion } from 'framer-motion';
import { replaceCDNBaseURL } from '../../utils/Tools';

// 扩展Window接口以包含全局方法
declare global {
    interface Window {
        $handleImageClick: ((url: string) => void) | undefined;
    }
}

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

    const handleImageClick = async (url: string) => {
        setSelectedImage(await replaceCDNBaseURL(url));
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // 确保在组件挂载时就绑定全局方法和事件监听器
    React.useEffect(() => {
        window.$handleImageClick = handleImageClick;
        // 调试日志已移除: console.log('🔧 图片点击处理器已绑定到window对象');

        // 添加全局点击事件监听器来处理图片点击
        const handleGlobalImageClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            // 检查点击的是否是图片或者图片的父元素
            let imgElement: HTMLImageElement | null = null;

            if (target.tagName === 'IMG') {
                imgElement = target as HTMLImageElement;
            } else if (target.closest('img')) {
                imgElement = target.closest('img') as HTMLImageElement;
            }

            // 如果找到了图片元素并且有clickable-image类
            if (imgElement && imgElement.classList.contains('clickable-image')) {
                const imageUrl = imgElement.getAttribute('data-image-url');
                if (imageUrl) {
                    // 调试日志已移除: console.log('🖼️ [DEBUG] 全局监听器捕获图片点击:', imageUrl);
                    handleImageClick(imageUrl);
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        };

        // 添加事件监听器
        document.addEventListener('click', handleGlobalImageClick, true);
        // 调试日志已移除: console.log('🔧 全局图片点击监听器已添加');

        return () => {
            // 清理时移除绑定和监听器
            delete window.$handleImageClick;
            document.removeEventListener('click', handleGlobalImageClick, true);
            // 调试日志已移除: console.log('🔧 全局图片点击监听器已移除');
        };
    }, []);
    // 添加调试日志
    // 调试日志已移除: console.log('🖼️ [DEBUG] ImageViewerProvider渲染状态:', {
    //     isModalOpen,
    //     selectedImage,
    //     hasChildren: !!children
    // });

    // 添加调试日志
    // 调试日志已移除: console.log('🖼️ [DEBUG] ImageViewerProvider渲染状态:', {
    //     isModalOpen,
    //     selectedImage,
    //     hasChildren: !!children,
    //     timestamp: new Date().toISOString()
    // });

    return (
        <ImageViewerContext.Provider value={{ handleImageClick }}>
            {children}
            {isModalOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}  // 初始透明
                        animate={{ opacity: 1 }}  // 动画过渡到不透明
                        exit={{ opacity: 0 }}     // 退出时透明
                        transition={{ duration: 0.3 }} // 过渡时间
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 999999,
                            pointerEvents: 'auto'
                        }}
                    >
                        <Modal imageUrl={selectedImage} onClose={handleCloseModal} />
                    </motion.div>
                </>
            )}
        </ImageViewerContext.Provider>
    );
};
