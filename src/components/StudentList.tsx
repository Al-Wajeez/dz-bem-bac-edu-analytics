import React from 'react';
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {CircleUser, Paperclip, Siren, AlertTriangle, LibraryBig, ChevronDown, ChevronUp, Printer } from 'lucide-react';

interface StudentListProps {
  data: any[];
  isDarkMode: boolean;
}

export const StudentList: React.FC<StudentListProps> = ({ data, isDarkMode }) => {
    const [openItems, setOpenItems] = useState<{ [key: number]: boolean }>({});

    const toggleItem = (index: number) => {
        setOpenItems((prev) => ({
          ...prev,
          [index]: !prev[index],
        }));
      };
  // Filter students who have issues to discuss
  const studentsWithIssues = data.filter(
    student => student['هل لديه مشكلة يريد مناقشتها'] === 'نعم'
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Add getCurrentYear function
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  // Add printStudentList function
  const printStudentList = () => {
    const directorate = data.length > 0 ? data[0]['المديرية'] : '';
    const institution = data.length > 0 ? data[0]['المؤسسة'] : '';
    
    const firstContent = `
        <table border="0" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
            <tr>
                <td colspan="2" style="text-align: center; border: 2px solid #ffffff;">
                    <strong>الجمهورية الجزائرية الديمقراطية الشعبية</strong><br>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: center; padding-bottom: 100px; border: 2px solid #ffffff;">
                    <p style="font-size: 1rem; font-weight: bold; margin: 0 0 0 0;">وزارة التربية الوطنية</p>
                </td>
            </tr>
            <tr>
                <td style="text-align: center; border: 2px solid #ffffff;">
                    <p style="font-size: 1rem; font-weight: bold; margin: 0 0 0 0;">${directorate}</p><br>
                    <p style="font-size: 1rem; font-weight: bold; margin: 0 0 0 0;">${institution}</p>
                </td>
                <td style="text-align: center; border: 2px solid #ffffff;">
                    <strong>السنة الدراسيــة: ${getCurrentYear()}/${getCurrentYear()-1}</strong>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: center; border: 2px solid #ffffff;">
                    <p style="font-size: 2rem; font-weight: bold; margin: 5rem 0 0 0;">قائمة التلاميذ</p><br>
                    <p style="font-size: 3.5rem; font-weight: bold; margin: 1rem;">الذين يحتاجون للمساعدة</p><br>
                    <p style="font-size: 2rem; font-weight: bold; margin: 0 0 10rem 0;">خاص بتلاميذ 4 متوسط</p>
                </td>
            </tr>
            <tr>
                <td style="text-align: center; border: 2px solid #ffffff;">
                    <p style="font-size: 1rem; font-weight: bold; margin: 0 0 0 0;">مستشار التوجيه والإرشاد المدرسي والمهني</p>
                </td>
                <td style="text-align: center; border: 2px solid #ffffff;">
                    <p style="font-size: 1rem; font-weight: bold; margin: 0 0 0 0;">المديــــر(ة)</p>
                </td>
            </tr>
        </table>
    `;

    const studentsContent = studentsWithIssues.map((student, index) => `
        <div style="page-break-inside: avoid; margin-bottom: 30px; margin-top: 30px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <div style="padding: 1px 16px; border-bottom: 1px solid #e5e7eb; background-color: #f9fafb;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <h3 style="font-size: 1.125rem; font-weight: 600;">${student['اللقب و الاسم']}</h3>
                        <p style="font-size: 0.875rem; font-weight: 600;">| ${student['القسم']}</p>
                    </div>
                </div>
            </div>

            <div style="padding: 24px;">
                <div style="margin-bottom: 16px;">
                    <h4 style="font-weight: 600; margin-bottom: 8px;">دراسة الحالة:</h4>
                    
                    <p style="margin-bottom: 16px; line-height: 1.6;">
                        التلميذ (ة) 
                        <span style="color: ${student['الجنس'] === 'ذكر' ? '#2563eb' : '#db2777'}">
                            ${student['اللقب و الاسم']}،
                        </span>
                        ${student['الإعادة'] === 'نعم' ? 'معيد(ة)' : 'غير معيد(ة)'}، 
                        ${student['الجنس'] === 'ذكر' ? 'يدرس' : 'تدرس'} في قسم ${student['القسم']} ب${student['المؤسسة']} التابعة لمديرية ${student['المديرية']}. 
                        ${student['هل الأب متوفي'] === 'نعم' ? (student['الجنس'] === 'ذكر' ? 'فقد والده' : 'فقدت والدها') : 'والده على قيد الحياة'}، 
                        و${student['هل الأم متوفية'] === 'نعم' ? (student['الجنس'] === 'ذكر' ? 'فقد والدته' : 'فقدت والدتها') : 'والدتها على قيد الحياة'}، 
                        ${student['هل الأبوين منفصلان'] === 'نعم' 
                            ? `و${student['الجنس'] === 'ذكر' ? 'يعيش' : 'تعيش'} في بيئة أسرية منفصلة` 
                            : `و${student['الجنس'] === 'ذكر' ? 'يعيش في بيئة أسرية مستقرة حيث والديه غير منفصلين' : 'تعيش في بيئة أسرية مستقرة حيث والديها غير منفصلين'}`}.
                    </p>

                    <p style="margin-bottom: 16px; line-height: 1.6;">
                        ${student['هل يعاني من صعوبات دراسية'] === 'نعم'  
                            ? `${student['الجنس'] === 'ذكر' 
                                ? `حيث يعاني من صعوبات دراسية، تتمثل أساسًا في ${student['ما هي الصعوبات']}، مما قد يؤثر على تحصيله الأكاديمي` 
                                : `حيث تعاني من صعوبات دراسية، تتمثل أساسًا في ${student['ما هي الصعوبات']}، مما قد يؤثر على تحصيلها الأكاديمي`}`
                            : student['الجنس'] === 'ذكر' 
                                ? 'حيث لا يعاني من صعوبات دراسية.' 
                                : 'حيث لا تعاني من صعوبات دراسية.'
                        }
                        ${student['هل يعاني من صعوبات دراسية'] === 'نعم' && student['المواد الصعبة']
                            ? `${student['الجنس'] === 'ذكر' 
                                ? `كما يجد صعوبة في بعض المواد، خاصة ${Array.isArray(student['المواد الصعبة']) 
                                    ? student['المواد الصعبة'].map((subject) => subject.value || subject).join('، ') 
                                    : student['المواد الصعبة']}، مما يستدعي دعماً تربوياً لتعزيز مهاراته في هذه المجالات.` 
                                : `كما تجد صعوبة في بعض المواد، خاصة ${Array.isArray(student['المواد الصعبة']) 
                                    ? student['المواد الصعبة'].map((subject) => subject.value || subject).join('، ') 
                                    : student['المواد الصعبة']}، مما يستدعي دعماً تربوياً لتعزيز مهاراتها في هذه المجالات.`}`
                            : ''}
                    </p>

                    <p style="margin-bottom: 16px; line-height: 1.6;">
                        ${student['الجنس'] === 'ذكر' 
                            ? `يطمح إلى مواصلة مساره في الجذع المشترك ${student['الجذع المشترك المرغوب']}، 
                                ويأمل في أن يصبح ${student['المهنة التي يتمناها في المستقبل']} مستقبلاً، 
                                وهو طموح يتطلب تنمية مهاراته وتعزيز ثقته بنفسه.`
                            : `تطمح إلى مواصلة مسارها في الجذع المشترك ${student['الجذع المشترك المرغوب']}، 
                                وتأمل في أن تصبح ${student['المهنة التي يتمناها في المستقبل']} مستقبلاً، 
                                وهو طموح يتطلب تنمية مهاراتها وتعزيز ثقتها بنفسها.`}

                        ${student['هل لديه معلومات كافية حول مشروعه المستقبلي'] === 'نعم' 
                            ? (student['الجنس'] === 'ذكر' ? ' يمتلك معلومات كافية حول مشروعه المستقبلي' : ' تمتلك معلومات كافية حول مشروعها المستقبلي') 
                            : (student['الجنس'] === 'ذكر' ? ' يحتاج إلى مزيد من المعلومات حول مشروعه المستقبلي' : ' تحتاج إلى مزيد من المعلومات حول مشروعها المستقبلي')}

                        ${student['هل ناقش مشروعه الدراسي مع والديه'] === 'نعم' 
                            ? (student['الجنس'] === 'ذكر' ? '، وقد ناقش مشروعه الدراسي مع والديه.' : '، وقد ناقشت مشروعها الدراسي مع والديها.') 
                            : (student['الجنس'] === 'ذكر' ? '، ولم يناقش مشروعه الدراسي مع والديه.' : '، ولم تناقش مشروعها الدراسي مع والديها.')}
                    </p>

                    <p>
                        ${student['هل لديه مشكلة يريد مناقشتها'] === 'نعم'
                            ? student['الجنس'] === 'ذكر'
                                ? `يواجه بعض التحديات الشخصية التي يحتاج إلى مناقشتها، ومن بينها: ${student['ما المعلومات التي يحتاجها'] || 'لم يتم التحديد'}، 
                                    وهو ما يستدعي توجيهاً بيداغوجياً يساعده في التعبير عن مخاوفه وإيجاد الحلول المناسبة لدعم مساره الدراسي والنفسي.`
                                : `تواجه بعض التحديات الشخصية التي تحتاج إلى مناقشتها، ومن بينها: ${student['ما المعلومات التي يحتاجها'] || 'لم يتم التحديد'}، 
                                    وهو ما يستدعي توجيهاً بيداغوجياً يساعدها في التعبير عن مخاوفها وإيجاد الحلول المناسبة لدعم مسارها الدراسي والنفسي.`
                            : student['الجنس'] === 'ذكر'
                                ? 'لا يواجه مشكلات تتطلب مناقشة حالياً.'
                                : 'لا تواجه مشكلات تتطلب مناقشة حالياً.'
                        }
                    </p>


                    <div style="margin-top: 24px;">
                        <h4 style="font-weight: 600; margin-bottom: 8px; color: #991b1b;">المشكلة المطروحة:</h4>
                        <div style="padding: 1px 16px; background-color: #fee2e2; border-radius: 8px; color: #991b1b;">
                            <p>${student['ما هي المشكلة']}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    const win = window.open('', '', 'height=700,width=700');
    if (!win) return;

    win.document.write(`
        <html>
            <head>
                <title>قائمة التلاميذ الذين يحتاجون للمساعدة</title>
                <style>
                    body {
                        direction: rtl;
                        font-family: 'Cairo', sans-serif;
                        line-height: 1.6;
                        padding: 20px;
                    }
                    @media print {
                        body {
                            padding: 0;
                        }
                        .page-break {
                            page-break-before: always;
                        }
                    }
                </style>
            </head>
            <body>
                ${firstContent}
                <div class="page-break">
                    ${studentsContent}
                </div>
            </body>
        </html>
    `);

    win.document.close();
    win.print();
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="py-8 mt-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <LibraryBig className="text-gray-500" />
                قائمة التلاميذ الذين لديهم مشاكل
                <span className="text-sm font-normal text-gray-500">
                    ({studentsWithIssues.length} تلميذ)
                </span>
            </h2>
            <button
                onClick={printStudentList}
                className="flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
                طباعة القائمة
                <Printer className="w-4 h-4 mr-2" />
            </button>
        </div>

        {studentsWithIssues.length === 0 ? (
            <motion.div 
                className="text-center py-8 text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
            لا يوجد تلاميذ لديهم مشاكل حاليا
            </motion.div>
        ) : (
            <motion.div 
                className="grid gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
            {studentsWithIssues.map((student, index) => (
            <motion.div
                key={index}
                variants={itemVariants}
                className={`border rounded-lg shadow-sm overflow-hidden${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            >
                {/* Header */}  
                <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                onClick={() => toggleItem(index)}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CircleUser className="text-gray-500" />
                            <h3 className="text-lg font-semibold">{student['اللقب و الاسم']}</h3>
                            <p className="text-sm font-semibold">| {student['القسم']}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 
                                ${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
                                <Siren className={`${isDarkMode ? 'text-red-200' : 'text-red-800'}`}/>
                                {student['الجنس'] === 'ذكر' ? 'يحتاج للمساعدة' : 'تحتاج للمساعدة'}
                            </span>
                        {openItems[index] ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {openItems[index] && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 grid grid-cols-1 md:grid-cols-1 gap-6"
                    >
                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2">
                                <Paperclip className="text-gray-500" />
                                دراسة الحالة:
                            </h4>

                            {/* Cases */}
                            <div className="space-y-4">
                                
                                <p>
                                التلميذ (ة) 
                                <span className={`py-4 px-1 ${student['الجنس'] === 'ذكر' ? 'text-blue-600' : 'text-pink-600'}`}>
                                    {student['اللقب و الاسم']}،
                                </span>
                                {student['الإعادة'] === 'نعم' ? 'معيد(ة)' : 'غير معيد(ة)'}، 
                                {student['الجنس'] === 'ذكر' ? 'يدرس' : 'تدرس'} في قسم {student['القسم']} ب{student['المؤسسة']} التابعة لمديرية {student['المديرية']}. 
                                {student['هل الأب متوفي'] === 'نعم' ? (student['الجنس'] === 'ذكر' ? 'فقد والده' : 'فقدت والدها') : 'والده على قيد الحياة'}، 
                                و{student['هل الأم متوفية'] === 'نعم' ? (student['الجنس'] === 'ذكر' ? 'فقد والدته' : 'فقدت والدتها') : 'والدتها على قيد الحياة'}، 
                                {student['هل الأبوين منفصلان'] === 'نعم' 
                                    ? `و${student['الجنس'] === 'ذكر' ? 'يعيش' : 'تعيش'} في بيئة أسرية منفصلة` 
                                    : `و${student['الجنس'] === 'ذكر' ? 'يعيش في بيئة أسرية مستقرة حيث والديه غير منفصلين' : 'تعيش في بيئة أسرية مستقرة حيث والديها غير منفصلين'}`}.
                                </p>

                                <p>
                                {student['هل يعاني من صعوبات دراسية'] === 'نعم'  
                                    ? `${student['الجنس'] === 'ذكر' 
                                        ? `حيث يعاني من صعوبات دراسية، تتمثل أساسًا في ${student['ما هي الصعوبات']}، مما قد يؤثر على تحصيله الأكاديمي` 
                                        : `حيث تعاني من صعوبات دراسية، تتمثل أساسًا في ${student['ما هي الصعوبات']}، مما قد يؤثر على تحصيلها الأكاديمي`}`
                                    : student['الجنس'] === 'ذكر' 
                                        ? 'حيث لا يعاني من صعوبات دراسية.' 
                                        : 'حيث لا تعاني من صعوبات دراسية.'
                                }، {student['هل يعاني من صعوبات دراسية'] === 'نعم' && student['المواد الصعبة']
                                    ? `${student['الجنس'] === 'ذكر' 
                                        ? `كما يجد صعوبة في بعض المواد، خاصة ${Array.isArray(student['المواد الصعبة']) 
                                            ? student['المواد الصعبة'].map((subject: any) => subject.value || subject).join('، ') 
                                            : student['المواد الصعبة']}، مما يستدعي دعماً تربوياً لتعزيز مهاراته في هذه المجالات.` 
                                        : `كما تجد صعوبة في بعض المواد، خاصة ${Array.isArray(student['المواد الصعبة']) 
                                            ? student['المواد الصعبة'].map((subject: any) => subject.value || subject).join('، ') 
                                            : student['المواد الصعبة']}، مما يستدعي دعماً تربوياً لتعزيز مهاراتها في هذه المجالات.`}`
                                    : ''}
                                </p>

                                <p>
                                {student['الجنس'] === 'ذكر' 
                                    ? `يطمح إلى مواصلة مساره في الجذع المشترك ${student['الجذع المشترك المرغوب']}، 
                                        ويأمل في أن يصبح ${student['المهنة التي يتمناها في المستقبل']} مستقبلاً، 
                                        وهو طموح يتطلب تنمية مهاراته وتعزيز ثقته بنفسه.`
                                    : `تطمح إلى مواصلة مسارها في الجذع المشترك ${student['الجذع المشترك المرغوب']}، 
                                        وتأمل في أن تصبح ${student['المهنة التي يتمناها في المستقبل']} مستقبلاً، 
                                        وهو طموح يتطلب تنمية مهاراتها وتعزيز ثقتها بنفسها.`}

                                {student['هل لديه معلومات كافية حول مشروعه المستقبلي'] === 'نعم' 
                                    ? (student['الجنس'] === 'ذكر' ? ' يمتلك معلومات كافية حول مشروعه المستقبلي' : ' تمتلك معلومات كافية حول مشروعها المستقبلي') 
                                    : (student['الجنس'] === 'ذكر' ? ' يحتاج إلى مزيد من المعلومات حول مشروعه المستقبلي' : ' تحتاج إلى مزيد من المعلومات حول مشروعها المستقبلي')}

                                {student['هل ناقش مشروعه الدراسي مع والديه'] === 'نعم' 
                                    ? (student['الجنس'] === 'ذكر' ? '، وقد ناقش مشروعه الدراسي مع والديه.' : '، وقد ناقشت مشروعها الدراسي مع والديها.') 
                                    : (student['الجنس'] === 'ذكر' ? '، ولم يناقش مشروعه الدراسي مع والديه.' : '، ولم تناقش مشروعها الدراسي مع والديها.')}
                                </p>

                                <p>
                                {student['هل لديه مشكلة يريد مناقشتها'] === 'نعم'
                                    ? student['الجنس'] === 'ذكر'
                                    ? `يواجه بعض التحديات الشخصية التي يحتاج إلى مناقشتها، ومن بينها: ${student['ما المعلومات التي يحتاجها']}، 
                                        وهو ما يستدعي توجيهاً بيداغوجياً يساعده في التعبير عن مخاوفه وإيجاد الحلول المناسبة لدعم مساره الدراسي والنفسي.`
                                    : `تواجه بعض التحديات الشخصية التي تحتاج إلى مناقشتها، ومن بينها: ${student['ما المعلومات التي يحتاجها']}، 
                                        وهو ما يستدعي توجيهاً بيداغوجياً يساعدها في التعبير عن مخاوفها وإيجاد الحلول المناسبة لدعم مسارها الدراسي والنفسي.`
                                    : student['الجنس'] === 'ذكر'
                                    ? 'لا يواجه مشكلات تتطلب مناقشة حالياً.'
                                    : 'لا تواجه مشكلات تتطلب مناقشة حالياً.'}
                                </p>

                            </div>

                            {/* Specific Problems */}
                            <div className="col-span-full space-y-4">
                                <h4 className="font-semibold flex items-center gap-2 text-red-800">
                                    <AlertTriangle className="text-red-800" />
                                    المشكلة المطروحة
                                </h4>
                                <motion.div 
                                className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                <p>{student['ما هي المشكلة']}</p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                  )}
                </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
