import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen, onClose, title, subtitle, children, size = 'md',
}) => {
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-[2px]" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200" enterFrom="opacity-0 scale-[0.97] translate-y-1" enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-[0.97]"
            >
              <Dialog.Panel
                className={`w-full ${sizes[size]} bg-white rounded-2xl shadow-[0_20px_60px_-12px_rgba(15,23,42,0.18),0_0_0_1px_rgba(15,23,42,0.04)] overflow-hidden`}
              >
                {/* Header */}
                <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#f1f5f9]">
                  <div>
                    {title && (
                      <Dialog.Title as="h3" className="text-base font-semibold text-[#0f172a]">
                        {title}
                      </Dialog.Title>
                    )}
                    {subtitle && <p className="text-xs text-[#94a3b8] mt-0.5">{subtitle}</p>}
                  </div>
                  <button
                    onClick={onClose}
                    className="ml-4 p-1 rounded-lg text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f5f9] transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="px-6 py-5">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};