import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { BarChart, Printer, FileSpreadsheet, Filter, NotebookPen, BarChart2 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';

import { useFilterStore } from '../../lib/DiffrencefilterStore';
import { filterStudents } from '../../utils/DiffrencefilterStudents';
import { FilterModal } from './filter/DiffrenceFilterModal';

// Printable Analysis
import SubjectStatsPrintableAnalysis from './printanalysis/SubjectStats';
import GradeDistributionPrintableAnalysis from './printanalysis/GradeDistribution';
import CategoryDistributionPrintableAnalysis from './printanalysis/CategoryStats';
import HarmonyPrintableAnalysis from './printanalysis/HarmonyStats';
import DetailedGradePrintableAnalysis from './printanalysis/DetailedGradeDistribution';
import RepeatDifferencePrintableAnalysis from './printanalysis/RepeatDifference';
import GenderDifferencePrintableAnalysis from './printanalysis/GenderDifference';
import SubjectPassPrintableAnalysis from './printanalysis/SubjectPass';
import GeneralDepartmentPerformanceAnalysis from './printanalysis/DepartmentStats';
import SchoolPerformancePrintableAnalysis from './printanalysis/SchoolStats';
import DirectoratePerformancePrintableAnalysis from './printanalysis/DirectoratePerformanceStats';
import MeritPerformancePrintableAnalysis from './printanalysis/MeritStats';
import FailingStudentsPrintableAnalysis from './printanalysis/LowestFailing';
import TopStudentsPrintableAnalysis from './printanalysis/TopStudents';

// Chats
import SubjectStatsChart from './charts/SubjectStatsChart';
import GradeDistributionChart from './charts/GradeDistributionChart';
import CategoryStatsChart from './charts/CategoryStatsChart';
import HarmonyStatsChart from './charts/HarmonyStatsChart';
import DetailedGradeDistributionChart from './charts/DetailedGradeDistributionChart';
import RepeatDifferenceChart from './charts/RepeatDifferenceChart';
import GenderDifferenceChart from './charts/GenderDifferenceChart';
import SubjectPassChart from './charts/SubjectPassChart';
import DepartmentStatsChart from './charts/DepartmentStatsChart';
import SchoolStatsChart from './charts/SchoolStatsChart';
import DirectoratePerformanceStatsChart from './charts/DirectoratePerformanceStatsChart';
import MeritChart from './charts/MeritStatsChart';

// Qualitative Analysis
import SubjectStatsQualitativeAnalysis from './QualitativeAnalysis/SubjectStatsQualitativeAnalysis';
import GradeDistributionQualitativeAnalysis from './QualitativeAnalysis/GradeDistributionQualitativeAnalysis';
import SubjectPassQualitativeAnalysis from './QualitativeAnalysis/SubjectPassQualitativeAnalysis';
import GenderDifferenceQualitativeAnalysis from './QualitativeAnalysis/GenderDifferenceQualitativeAnalysis';
import RepeatDifferenceQualitativeAnalysis from './QualitativeAnalysis/RepeatDifferenceQualitativeAnalysis';
import DetailedGradeDistributionQualitativeAnalysis from './QualitativeAnalysis/DetailedGradeDistributionQualitativeAnalysis';
import HarmonyStatsQualitativeAnalysis from './QualitativeAnalysis/HarmonyStatsQualitativeAnalysis';
import CategoryStatsQualitativeAnalysis from './QualitativeAnalysis/CategoryStatsQualitativeAnalysis';
import DepartmentStatsQualitativeAnalysis from './QualitativeAnalysis/DepartmentStatsQualitativeAnalysis';
import SchoolStatsQualitativeAnalysis from './QualitativeAnalysis/SchoolStatsQualitativeAnalysis';
import DirectoratePerformanceStatsQualitativeAnalysis from './QualitativeAnalysis/DirectoratePerformanceStatsQualitativeAnalysis';
import MeritQualitativeAnalysis from './QualitativeAnalysis/MeritQualitativeAnalysis';
import TopStudentsQualitativeAnalysis from './QualitativeAnalysis/TopStudentsQualitativeAnalysis';
import LowestFailingStudentsQualitativeAnalysis from './QualitativeAnalysis/LowestFailingStudentsQualitativeAnalysis';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const exportToExcel = (tableId: string) => {
  const table = document.getElementById(tableId);
  if (!table) return;

  const wb = XLSX.utils.table_to_book(table);
  XLSX.writeFile(wb, `${tableId}.xlsx`);
};

const printTable = (tableId: string, titleId?: string) => {
  const printContent = document.getElementById(tableId)?.outerHTML;
  if (!printContent) return;

  const tableTitle = titleId ? document.getElementById(titleId)?.outerHTML ?? '' : '';

  const win = window.open('', '', 'height=700,width=700');
  if (!win) return;

  win.document.write(`
    <html>
      <head>
        <title>برنامج الوجيز - التوجيه المدرسي</title>
        <style>
          body { direction: rtl; font-family: 'Cairo', sans-serif; }
          table { min-width: 100%; border-collapse: collapse; margin: 1rem 0; }
          th, td { border: 1px solid #e5e7eb; padding: 0.5rem 0.2rem; text-align: center; }
          thead tr {
          background-color: #f9fafb;
          font-size: 0.9em;
          }
          tbody tr { background-color: white; }
          tfoot tr { background-color: #f9fafb; font-weight: 600; }
          h1, h2, h3, h4, h5, h6, p {
            text-align: center;
            margin: 1rem 0;
            font-size: 1.3em;
          }
          @media print {
            .print\\:hidden { 
              display: none !important; 
            }
          }
        </style>
      </head>
      <body>
        ${tableTitle}
        ${printContent}
      </body>
    </html>
  `);

  win.document.close();
  win.print();
};

const printAllTablesByClass = (tableClass = 'printable-table', titleClass = 'table-title', students: Student[] = []) => {
  const tables = document.querySelectorAll<HTMLTableElement>(`table.${tableClass}`);

  if (!tables.length) return;

  // Extract unique directorates and filter out empty/null values
  const directorates = [...new Set(students.map(s => s['المديرية']))]
    .filter((dir): dir is string => !!dir && typeof dir === 'string');
  
  // Extract unique schools and filter out empty/null values
  const schools = [...new Set(students.map(s => s['المؤسسة']))]
    .filter((school): school is string => !!school && typeof school === 'string');

  const subjects = ['المعدل السنوي'];
  const totalStudents = students.length;
  let totalPassCount = 0;
  const subject = subjects[0]; // 'معدل الإنتقال'

  // Extract greades greater then 10
  const passCount = students.filter(student => student[subject] >= 10).length;
  totalPassCount += passCount;
  const passPercentage = (passCount / totalStudents) * 100;

  //const totalPassPercentage = Number(
  //  ((totalPassCount / (totalStudents * subjects.length)) * 100).toFixed(2)
  //);

  // Extract greades greater then 10 Gender Breakdown
  const maleStudents = students.filter(student => student['الجنس'] === 'ذكر');
  const maleTotal = maleStudents.length;
  const malePassCount = maleStudents.filter(student => student[subject] >= 10).length;
  const malePassPercentage = maleTotal > 0
    ? Number(((malePassCount / maleTotal) * 100).toFixed(2))
    : 0;

  const femaleStudents = students.filter(student => student['الجنس'] === 'أنثى');
  const femaleTotal = femaleStudents.length;
  const femalePassCount = femaleStudents.filter(student => student[subject] >= 10).length;
  const femalePassPercentage = femaleTotal > 0
    ? Number(((femalePassCount / femaleTotal) * 100).toFixed(2))
    : 0;

  //const diffrise =
  //femalePassPercentage > malePassPercentage
  //  ? "ارتفعت"
  //  : "انخفضت";

  const diffsuperiority =
  femalePassPercentage > malePassPercentage
    ? "الإناث تفوقن على الذكور"
    : "الذكور تفوقوا على الإناث";

  const diffperformance =
  femalePassPercentage > malePassPercentage
    ? "التلميذات"
    : "التلاميذ";

  // Calculate repeat vs non-repeat statistics
  const repeatStudents = students.filter(student => student['الإعادة'] === 'نعم');
  const repeatTotal = repeatStudents.length;
  const repeatPassCount = repeatStudents.filter(student => student[subject] >= 10).length;
  const repeatPassPercentage = repeatTotal > 0
    ? Number(((repeatPassCount / repeatTotal) * 100).toFixed(2))
    : 0;

  const nonRepeatStudents = students.filter(student => student['الإعادة'] === 'لا');
  const nonRepeatTotal = nonRepeatStudents.length;
  const nonRepeatPassCount = nonRepeatStudents.filter(student => student[subject] >= 10).length;
  const nonRepeatPassPercentage = nonRepeatTotal > 0
    ? Number(((nonRepeatPassCount / nonRepeatTotal) * 100).toFixed(2))
    : 0;

  const diffrepeatrise =
  repeatPassPercentage > nonRepeatPassPercentage
    ? "المعيدين"
    : "غير المعيدين";

  const diffrepeatperformance =
  femalePassPercentage > malePassPercentage
    ? "الاستمرارية الدراسية دون انقطاع تؤثر إيجابًا على التحصيل"
    : "عامل التكرار ساعد البعض على تدارك تعثرهم السابق";  

  // Calculate department statistics
  const departmentStats = students.reduce((acc, student) => {
    const dept = student['القسم'];
    if (!acc[dept]) {
      acc[dept] = {
        total: 0,
        passCount: 0,
        sum: 0
      };
    }
    acc[dept].total++;
    if (student[subject] >= 10) {
      acc[dept].passCount++;
    }
    acc[dept].sum += student[subject];
    return acc;
  }, {} as { [key: string]: { total: number; passCount: number; sum: number } });

  const transitionStats = Object.entries(departmentStats).reduce((acc, [dept, stats]) => {
    const mean = stats.sum / stats.total;
    if (!acc.highestMean || mean > acc.highestMean) {
      acc.highestMean = mean;
      acc.highestDepartment = dept;
    }
    if (!acc.lowestMean || mean < acc.lowestMean) {
      acc.lowestMean = mean;
      acc.lowestDepartment = dept;
    }
    return acc;
  }, { highestMean: 0, lowestMean: 0, highestDepartment: '', lowestDepartment: '' });

  const highestMean = transitionStats?.highestMean.toFixed(2) ?? 0;
  const lowestMean = transitionStats?.lowestMean.toFixed(2) ?? 0;
  const highestDepartment = transitionStats?.highestDepartment;
  const lowestDepartment = transitionStats?.lowestDepartment;

  const stats = {
    subject,
    totalStudents,
    passCount,
    passPercentage: Number(passPercentage.toFixed(2)),
    totalPassPercentage: Number(passPercentage.toFixed(2)),

    maleTotal,
    malePassCount,
    malePassPercentage,

    femaleTotal,
    femalePassCount,
    femalePassPercentage,

    repeatTotal,
    repeatPassCount,
    repeatPassPercentage,

    nonRepeatTotal,
    nonRepeatPassCount,
    nonRepeatPassPercentage,
  };

  const currentYear = getCurrentYear();
  const previousYear = currentYear - 1;
  const directoratesText = directorates.join('، ') || '';
  const schoolsText = schools.join('، ') || '';
  const totalCount = students.length;
  const PassCount = stats.passCount;
  const NoPassCount = totalCount - PassCount;
  const PassPercentage = stats.totalPassPercentage;
  //const mTotal = stats.maleTotal;
  const mPassCount = stats.malePassCount;
  const mPassPercentage = stats.malePassPercentage;
  //const fTotal = stats.femaleTotal;
  const fPassCount = stats.femalePassCount;
  const fPassPercentage = stats.femalePassPercentage;
  //const rTotal = stats.repeatTotal;
  const rPassCount = stats.repeatPassCount;
  const rPassPercentage = stats.repeatPassPercentage;
  //const nrTotal = stats.nonRepeatTotal;
  const nrPassCount = stats.nonRepeatPassCount;
  const nrPassPercentage = stats.nonRepeatPassPercentage;

  const win = window.open('', '', 'height=700,width=900');
  if (!win) return;

  const tableHTMLBlocks = Array.from(tables).map(table => {
  const tableId = table.id;

  const analysisComponents = {
    subjectStats: document.querySelector('#subjectStatsAnalysis')?.innerHTML,
    gradeDistribution: document.querySelector('#gradeDistributionAnalysis')?.innerHTML,
    subjectPass: document.querySelector('#subjectPassAnalysis')?.innerHTML,
    genderStats: document.querySelector('#genderStatsAnalysis')?.innerHTML,
    repeatStats: document.querySelector('#repeatStatsAnalysis')?.innerHTML,
    detailedGradeDistribution: document.querySelector('#detailedGradeDistributionAnalysis')?.innerHTML,
    harmonyStats: document.querySelector('#harmonyStatsAnalysis')?.innerHTML,
    categoryStats: document.querySelector('#categoryStatsAnalysis')?.innerHTML,
    departmentStats: document.querySelector('#departmentStatsAnalysis')?.innerHTML,
    schoolStats: document.querySelector('#schoolStatsAnalysis')?.innerHTML,
    directorateStats: document.querySelector('#directorateAnalysis')?.innerHTML,
    meritStats: document.querySelector('#meritStatsAnalysis')?.innerHTML,
    topStudents: document.querySelector('#topStudentsAnalysis')?.innerHTML,
    lowestFailingStudents: document.querySelector('#lowestFailingStudentsAnalysis')?.innerHTML,
    dynamicStatisticalCount: document.querySelector(`#${tableId}Analysis`)?.innerHTML, // moved here
  };

  const titleEl = table.previousElementSibling?.classList.contains(titleClass)
    ? table.previousElementSibling.outerHTML
    : '';

  // Get the corresponding analysis based on the table ID
  let analysisHTML = '';
  switch (tableId) {
    case 'subjectStatsTable':
      analysisHTML = analysisComponents.subjectStats || '';
      break;
    case 'gradeDistributionTable':
      analysisHTML = analysisComponents.gradeDistribution || '';
      break;
    case 'subjectPassTable':
      analysisHTML = analysisComponents.subjectPass || '';
      break;
    case 'genderDifferenceTable':
      analysisHTML = analysisComponents.genderStats || '';
      break;
    case 'repeatDifferenceTable':
      analysisHTML = analysisComponents.repeatStats || '';
      break;
    case 'detailedGradeDistributionTable':
      analysisHTML = analysisComponents.detailedGradeDistribution || '';
      break;
    case 'harmonyStatsTable':
      analysisHTML = analysisComponents.harmonyStats || '';
      break;
    case 'categoryStatsTable':
      analysisHTML = analysisComponents.categoryStats || '';
      break;
    case 'departmentStatstable':
      analysisHTML = analysisComponents.departmentStats || '';
      break;
    case 'Schoolstatstable':
      analysisHTML = analysisComponents.schoolStats || '';
      break;
    case 'DirectoratePerformancestatstable':
      analysisHTML = analysisComponents.directorateStats || '';
      break;
    case 'Meritstatstable':
      analysisHTML = analysisComponents.meritStats || '';
      break;
    case 'TopStudentsstatstable':
      analysisHTML = analysisComponents.topStudents || '';
      break;
    case 'LowestFailingStudentsstatstable':
      analysisHTML = analysisComponents.lowestFailingStudents || '';
      break;
    default:
      // fallback for dynamic table IDs (e.g. StatisticalCountTable)
      analysisHTML = analysisComponents.dynamicStatisticalCount || '';
      break;
  }

  return `
    <div class="table-container">
      ${titleEl ? `<div class="table-title">${titleEl}</div>` : ''}
      ${table.outerHTML}
      ${
        analysisHTML
          ? `
        <style>
          .analysis-section p {
            font-size: 18.7px;
            text-align: justify;
            line-height: 1.5;
            margin-bottom: 1em;
          }
        </style>
        <div class="analysis-section" style="margin-top: 20px; padding: 20px; background-color: rgb(255, 255, 255);">
          ${analysisHTML}
        </div>
        `
          : ''
      }
    </div>
  `;
});

  //page-break-before: always

  const firstContent = `
        <table border="0" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
          <tr>
            <td colspan="2" style="text-align: center; border: 2px solid #ffffff;">
              <strong>الجمهورية الجزائرية الديمقراطية الشعبية</strong><br>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: center; padding-bottom: 70px; border: 2px solid #ffffff;">
              <p style="font-size: 1.2rem; font-weight: bold; margin: 0 0 0 0;">وزارة التربية الوطنية</p>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; border: 2px solid #ffffff;">
              <p style="font-size: 1.2rem; font-weight: bold; margin: 0 0 0 0;">${directoratesText}</p><br>
              <p style="font-size: 1.2rem; font-weight: bold; margin: 0 0 0 0;">${schoolsText}</p>
            </td>
            <td style="text-align: center; border: 2px solid #ffffff;">
              <strong>السنة الدراسيــة: ${currentYear}/${previousYear}</strong>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: center; border: 2px solid #ffffff;">
              <p style="font-size: 2rem; font-weight: bold; margin: 4rem 0 0 0;">تحليل</p><br>
              <p style="font-size: 3.5rem; font-weight: bold; margin: 1rem;">النتائج السنوية</p><br>
              <p style="font-size: 1.5rem; font-weight: bold; margin: 0 0 0 0;">دورة - ${currentYear}</p><br>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; border: 2px solid #ffffff;">
              <p style="font-size: 1.2rem; font-weight: bold; margin: 0 0 0 0;">مستشار التوجيه والإرشاد المدرسي والمهني</p>
            </td>
            <td style="text-align: center; border: 2px solid #ffffff;">
              <p style="font-size: 1.2rem; font-weight: bold; margin: 0 0 0 0;">المديــــر(ة)</p>
            </td>
          </tr>
        </table>
      `;
//style="color: #2d3748; border-bottom: 2px solid #ddd; padding-bottom: 8px;"
  const introContent = `
    <div dir="rtl" style="page-break-before: always; font-family: 'Cairo'; line-height: 1.5; font-size: 18.7px; text-align: justify;">
      <h1 style="text-align: center; margin-bottom: 30px;">تقرير تحليل النتائج السنوية للتلاميذ</h1>

      <div class="intro-section">
        <h2 style="color: #2d3748; border-bottom: 2px solid #ddd; padding-bottom: 8px;">1. المقدمة</h2>
        <p>
          في إطار المتابعة البيداغوجية لمستوى تحصيل التلاميذ خلال السنة الدراسية ${currentYear}، تم إجراء تقييمات دورية واختبارات فصلية شكلت مرجعًا أساسيًا لبناء هذا التقرير السنوي. وبلغ العدد الإجمالي للتلاميذ الذين شملهم التقييم ${totalCount}، حقق منهم ${PassCount} نتائج مرضية وفق المعدلات المعتمدة، في حين سجل ${NoPassCount} منهم أداءً دون المستوى، أي بنسبة نجاح عامة قدرها ${PassPercentage} بالمئة.
        </p>
        <p>
          بتحليل النتائج حسب الجنس، يُلاحظ أن ${fPassCount} من الإناث حققن المعدل السنوي، بنسبة ${fPassPercentage}، مقابل ${mPassCount} من الذكور بنسبة ${mPassPercentage}. ويُبرز هذا الفارق أن ${diffsuperiority} أظهروا تفوقًا واضحًا في الأداء العام، مما يعكس ${diffperformance} تربويًا يميز هذه الفئة خلال الموسم الدراسي.
        </p>
        <p>
          وبالرجوع إلى صفة التلميذ (معيد أو غير معيد)، أظهرت المعطيات أن ${rPassCount} من المعيدين بلغوا المعدل، مقابل ${nrPassCount} من غير المعيدين. وبلغت نسبة النجاح لدى الفئة الأولى ${rPassPercentage} بالمئة، ولدى الثانية ${nrPassPercentage} بالمئة، ما يدل على أن ${diffrepeatrise} أظهروا ${diffrepeatperformance}، وهو مؤشر يستحق الدراسة التربوية والدعم المستهدف.
        </p>
        <p>
          أما على مستوى الأداء الجماعي للأقسام، فقد تميّز القسم ${highestDepartment} بتحقيق أعلى معدل سنوي بـ ${highestMean}، مما يعكس بيئة صفية محفزة ومنظومة تعليمية فعّالة. في المقابل، سجّل القسم ${lowestDepartment} أدنى معدل بـ ${lowestMean}، وهو ما يتطلب دراسة متأنية للعوامل المؤثرة في هذا التراجع، سواء البيداغوجية أو التنظيمية أو التحفيزية.
        </p>
        <p>
          إن هذا التقرير لا يكتفي بعرض الأرقام، بل يهدف إلى تقديم قراءة تحليلية تساعد الفرق التربوية على بناء خطط تطويرية واقعية، موجهة نحو تحسين الأداء العام وضمان التحصيل الأمثل لكل فئة من التلاميذ.
        </p>
      </div>

      <div class="intro-section">
        <h2 style="color: #2d3748; border-bottom: 2px solid #ddd; padding-bottom: 8px; page-break-before: always;">2. خلفية التحليل</h2>
        <p>
          يرتكز هذا التحليل على مبدأ أن النتائج السنوية تمثل مرآة حقيقية لمستوى التلاميذ، وتعكس جودة التفاعل البيداغوجي داخل الأقسام. وتُعدّ هذه القراءة التربوية أداة تشخيصية تساعد على تقييم مردودية البرامج التعليمية وأساليب التدريس، من خلال تحديد نقاط القوة وتحديد مصادر التعثر، واقتراح سبل التحسين.
        </p>
      </div>

      <div class="intro-section">
        <h2 style="color: #2d3748; border-bottom: 2px solid #ddd; padding-bottom: 8px;">3. أهداف التقرير</h2>
        <p>
          يهدف هذا التقرير إلى تقديم قراءة علمية ومهنية للنتائج المحصل عليها خلال السنة الدراسية، واستنباط المؤشرات الدالة على جودة التعليم، مع تسليط الضوء على الفروقات الفردية والجماعية، واقتراح توصيات عملية قابلة للتنفيذ من أجل تعزيز التعلّم وتحسين أداء المؤسسة.
        </p>
      </div>

      <div class="intro-section">
        <h2 style="color: #2d3748; border-bottom: 2px solid #ddd; padding-bottom: 8px;">4. أهمية التحليل السنوي</h2>
        <p>
          إن التحليل السنوي للنتائج التعليمية يُعد أداة مركزية في دعم اتخاذ القرار التربوي، وتحديد أولويات التدخل. فهو لا يكتفي برصد الأداء، بل يُسهم في تفسيره ضمن سياقه التربوي، ويساعد على بلورة رؤية واضحة لتحسين جودة المخرجات التعليمية وتعزيز كفاءة التلاميذ في المراحل الدراسية القادمة.
        </p>
      </div>

      <div class="intro-section">
        <h2 style="color: #2d3748; border-bottom: 2px solid #ddd; padding-bottom: 8px;">5. منهجية العمل</h2>
        <p>
          تم اعتماد مقاربة مزدوجة في إعداد هذا التقرير، تقوم على التحليل الكمي للنتائج من خلال مؤشرات مثل المعدل والانحراف المعياري ونسبة النجاح، وتحليل نوعي يعتمد على ملاحظات المعلمين والمعطيات الصفية الميدانية. وقد تم تصنيف البيانات حسب الأقسام، الفئات، والجنس لتقديم صورة شاملة عن واقع التحصيل.
        </p>
      </div>

      <div class="intro-section">
        <h2 style="color: #2d3748; border-bottom: 2px solid #ddd; padding-bottom: 8px; page-break-before: always;">6. قراءة عامة للنتائج</h2>
        <p>
          أظهرت النتائج السنوية تفاوتًا بين تلاميذ المؤسسة من حيث الأداء، حيث تراوحت المعدلات العامة بين [أدنى معدل] و[أعلى معدل]، في حين بلغ المعدل العام للمؤسسة [xx,x/20]. وتُبرز هذه المؤشرات تمايزًا في مستويات التلاميذ، وتستدعي تحليلاً معمقًا لفهم أسباب القوة والضعف لدى كل فئة.
        </p>
      </div>

      <div class="intro-section">
        <h2 style="color: #2d3748; border-bottom: 2px solid #ddd; padding-bottom: 8px">7. خلاصة وتوصيات</h2>
        <p>
          يخلص التقرير إلى أن النتائج السنوية تعكس جهودًا ملموسة من قبل الطاقم التربوي، مع وجود تفاوتات تتطلب التدخل والدعم المستهدف. ومن التوصيات المقترحة: تكثيف الحصص الداعمة في المواد الأساسية، اعتماد مقاربات تشاركية بين الأساتذة، تتبع تطور التحصيل بانتظام، وتفعيل آليات المرافقة النفسية والبيداغوجية للتلاميذ المتعثرين.
        </p>
      </div>
    </div>
  `;

  const outroContent = `
    <div dir="rtl" style="page-break-before: always; font-family: 'Cairo'; line-height: 1.5; font-size: 18.7px; text-align: justify;">

      <div class="intro-section">
        <h2 style="color: #2d3748; border-bottom: 2px solid #ddd; padding-bottom: 8px;">6.	التوصيات والاقتراحات</h2>

        <p>
        بناءً على الجداول التي تم تقديمها وتحليلها، يمكن إجراء بعض التوصيات والاقتراحات:
        </p>

        <p>
        يمكن استخلاص جملة من الملاحظات التي تضيء المشهد التربوي للمؤسسة، أبرزها وجود تفاوتات ملحوظة بين الأقسام، ووجود فوارق فردية تستدعي تكييف طرق التدريس والدعم. كما تم تسجيل تحسن نسبي في بعض المواد مقارنة بالسنوات الماضية، مما يدل على نجاعة بعض التدخلات البيداغوجية. بالمقابل، لا تزال هناك مواد تتطلب مجهودًا إضافيًا، سواء من حيث المحتوى أو طرائق التدريس، إلى جانب ضرورة تعزيز الدعم التربوي للتلاميذ ذوي الصعوبات.
        </p>

        <ul style="list-style-type: square; margin-right: 30px;">

          <p>أولاً: على مستوى التلميذ:</p>
          <li>تنظيم حصص دعم موجهة لفائدة التلاميذ المتعثرين في المواد الأساسية.</li>
          <li>إعداد بطاقات متابعة فردية خاصة بالتلاميذ ذوي الأداء الضعيف.</li>
          <li>تشجيع التلاميذ على المراجعة الذاتية وتنمية الاستقلالية في التعلم.</li>
          <li>تحفيز المتفوقين وتنظيم أنشطة تنافسية لتعزيز الثقة في النفس.</li>

          <p>ثانياً: على مستوى الأستاذ:</p>
          <li>تنويع طرائق التدريس بما يتماشى مع فروقات التلاميذ ومستوياتهم.</li>
          <li>اعتماد التقييم التكويني بشكل منتظم لمراقبة مدى تحقق الأهداف التعليمية.</li>
          <li>تفعيل التعلم النشط من خلال العمل بالمجموعات وحل المشكلات.</li>
          <li>توظيف التغذية الراجعة الفعالة لتصحيح الأخطاء وتحفيز التلاميذ.</li>

          <p style="page-break-before: always;">ثالثاً: على مستوى المؤسسة</p>
          <li>برمجة دروس تقوية جماعية في المواد التي سجلت نسب نجاح ضعيفة.</li>
          <li>تنظيم لقاءات تنسيقية دورية بين الأساتذة لتبادل الخبرات الناجحة.</li>
          <li>إشراك مستشار التوجيه المدرسي في متابعة التلاميذ المحتاجين للدعم.</li>
          <li>إنشاء نادٍ للمراجعة والمطالعة داخل المؤسسة لتعزيز التفاعل الإيجابي.</li>

          <p>رابعاً: على مستوى الأسرة</p>
          <li>تفعيل آليات التواصل بين الأسرة والمؤسسة لتتبع المسار الدراسي.</li>
          <li>توعية الأولياء بأهمية المتابعة اليومية والدعم النفسي لأبنائهم.</li>
          <li>إشراك الأولياء في مجالس الأقسام وتقديم تقارير دورية حول تقدم أبنائهم.</li>

          <p>خامساً: على مستوى التسيير التربوي:</p>
          <li>إعداد خطة علاجية بداية من الفصل الأول بناءً على نتائج التقويمات التشخيصية.</li>
          <li>تنظيم أيام تكوينية لفائدة الأساتذة في مجالات التقويم والدعم البيداغوجي.</li>
          <li>الاستفادة من الوسائل الرقمية في دعم التعلمات وتقديم موارد تكميلية.</li>
          <li>تقييم البرامج السنوية ومقارنتها بمردود التلاميذ لتحديد مكامن النقص.</li>

      </div>

      <div class="intro-section">
        <p>
        تؤكد نتائج التحليل على ضرورة تبنّي خطة تربوية شاملة تقوم على دعم التلاميذ المتعثرين، وتحفيز المتفوقين، وتطوير أداء الهيئة التربوية من خلال التكوين والتنسيق البيداغوجي. كما تبرز أهمية تنويع طرائق التدريس وتكثيف التقييم التكويني، مع تعزيز آليات المتابعة الفردية للتلاميذ وتفعيل الشراكة بين الأسرة والمؤسسة. من جهة أخرى، يُوصى بتكريس بيئة تعليمية محفّزة تعتمد التعلم النشط، والاستفادة من الموارد الرقمية، وتكييف البرامج مع خصوصيات المتعلمين. ولتحقيق ذلك، ينبغي أن تتكامل جهود الفريق التربوي والإداري، بدعم من الأولياء والمحيط المدرسي، بما يسهم في تحسين المردودية التربوية ورفع نسب النجاح بشكل مستدام.
        </p>

        <h2 style="color: #2d3748; border-bottom: 2px solid #ddd; padding-bottom: 8px; page-break-before: always;">الخاتمة:</h2>
        <p>
        يمثل هذا التقرير مرآة صادقة تعكس واقع الأداء المدرسي وتحدياته، ويعد خطوة أساسية نحو ترسيخ ثقافة التقويم والبناء التربوي المستمر. إن تحسين النتائج ليس غاية في حد ذاته، بل هو ثمرة مسار تشاركي يعتمد على التقييم الموضوعي، والتخطيط الواعي، والالتزام الجماعي. وفي هذا الإطار، تظل المؤسسة التربوية فضاءً ديناميكيًا يستدعي دعمًا مستمرًا من مختلف الشركاء لتحقيق النجاح المنشود لتلاميذنا في المراحل التعليمية المقبلة.
        </p>
      </div>

    </div>
  `;

  win.document.write(`
    <html>
      <head>
        <title style="text-align: right;">برنامج الوجيز - شهادة التعليم المتوسط</title>
        <style>
          body { direction: rtl; font-family: 'Cairo', sans-serif; padding: 1rem; }
          table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
          th, td { border: 1px solid #e5e7eb; padding: 0.5rem 0.2rem; text-align: center; }
          thead tr { background-color: #f9fafb; font-size: 0.9em; }
          tbody tr { background-color: white; }
          tfoot tr { background-color: #f9fafb; font-weight: 600; }
          
          .table-container {
            margin-bottom: 2rem;
            page-break-after: always;
          }
          .table-title {
            margin-bottom: 0.5rem;
            font-size: 1.2em;
            font-weight: bold;
            text-align: center;
          }
          @media print {
            .no-print { display: none; }
            .page-break { page-break-before: always; }
            body::before {
            content: "موقع الوجيز - شهادة التعليم المتوسط";
            position: fixed;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 4rem;
            color: rgba(0, 0, 0, 0.1);
            z-index: 0;
            white-space: nowrap;
            pointer-events: none;
          }

            body { font-family: 'Cairo', sans-serif; direction: rtl; }
          }
        </style>
      </head>
      <body>
        ${firstContent}
        ${introContent}
        ${tableHTMLBlocks.join('')}
        ${outroContent}
      </body>
    </html>
  `);

  win.document.close();
  win.focus();
  win.print();

};

// Types
interface Student {
  'الجنس': 'ذكر' | 'أنثى';
  'الإعادة': 'نعم' | 'لا';
  'المديرية': string;
  'المؤسسة': string;
  'القسم': string;
  'القرار': string;
  'الملمح': string;
  'اللغة العربية': number;
  'اللغة الأمازيغية': number;
  'اللغة الفرنسية': number;
  'اللغة الإنجليزية': number;
  'التربية الإسلامية': number;
  'التربية المدنية': number;
  'التاريخ والجغرافيا': number;
  'الرياضيات': number;
  'ع الطبيعة و الحياة': number;
  'ع الفيزيائية والتكنولوجيا': number;
  'المعلوماتية': number;
  'التربية التشكيلية': number;
  'التربية الموسيقية': number;
  'ت البدنية و الرياضية': number;
  'المعدل': number;
  [key: string]: any;
}

// Utility to enrich students
function enrichStudentsWithDecisionAndProfile(students: Student[]): Student[] {
  const subjects = [
    'اللغة العربية',
    'اللغة الأمازيغية',
    'اللغة الفرنسية',
    'اللغة الإنجليزية',
    'التربية الإسلامية',
    'التربية المدنية',
    'التاريخ والجغرافيا',
    'الرياضيات',
    'ع الطبيعة و الحياة',
    'ع الفيزيائية والتكنولوجيا',
    'المعلوماتية',
    'التربية التشكيلية',
    'التربية الموسيقية',
    'ت البدنية و الرياضية',
  ];

  return students.map(student => {
    // Calculate semester averages for all subjects
    const semesterAverages: { [key: string]: number } = {};
    
    subjects.forEach((subject) => {
      const g1 = Number(student[`${subject} ف 1`]) || 0;
      const g2 = Number(student[`${subject} ف 2`]) || 0;
      const g3 = Number(student[`${subject} ف 3`]) || 0;

      const isValid = !isNaN(g1) && !isNaN(g2) && !isNaN(g3);
      semesterAverages[`${subject} م س`] = isValid ? Number(((g1 + g2 + g3) / 3).toFixed(2)) : 0;
    });

    // Decision logic
    const mainGrade = Number(student['معدل ش ت م']) || 0;
    const transferGrade = Number(student['معدل الإنتقال']) || 0;
    let decision = '';
    if (mainGrade >= 10) {
      decision = 'ينتقل إلى قسم أعلى';
    } else if (transferGrade >= 10) {
      decision = 'ينتقل إلى قسم أعلى';
    } else {
      decision = 'يعيد السنة';
    }

    // Profile logic
    const arabicGrade = semesterAverages['اللغة العربية م س'] || 0;
    const frenchGrade = semesterAverages['اللغة الفرنسية م س'] || 0;
    const englishGrade = semesterAverages['اللغة الإنجليزية م س'] || 0;
    const historyGrade = semesterAverages['التاريخ والجغرافيا م س'] || 0;
    const mathGrade = semesterAverages['الرياضيات م س'] || 0;
    const scienceGrade = semesterAverages['ع الطبيعة و الحياة م س'] || 0;
    const physicsGrade = semesterAverages['ع الفيزيائية والتكنولوجيا م س'] || 0;
    const tcl = ((arabicGrade * 5) + (frenchGrade * 4) + (englishGrade * 3) + (historyGrade * 2)) / 14;
    const tcs = ((arabicGrade * 2) + (mathGrade * 4) + (scienceGrade * 4) + (physicsGrade * 4)) / 14;
    let profile = '';
    if (tcl < tcs && transferGrade >= 10) {
      profile = 'جذع مشترك علوم وتكنولوجيا';
    } else if (tcl > tcs && transferGrade >= 10) {
      profile = 'جذع مشترك آداب وفلسفة';
    } else {
      profile = 'غير معني';
    }

    return {
      ...student,
      ...semesterAverages,
      'القرار': decision,
      'الملمح': profile,
    };
  });
}

type RemarkType = 'success' | 'warning' | 'danger' | 'info' | 'secondary';

//#region tables interface
interface SubjectStats {
  subject: string;
  presentCount: number;
  mean: number;
  stdDev: number;
  median: number;
  range: number;
  variance: number;
  remark: string;
  remarkType: RemarkType;
}


interface GenderStats {
  male: SubjectStats[];
  female: SubjectStats[];
}

interface RepeatStats {
  repeat: SubjectStats[];
  nonRepeat: SubjectStats[];
}

interface GenderDifferenceStats {
  subject: string;
  maleMean: number;
  femaleMean: number;
  maleStdDev: number;
  femaleStdDev: number;
  difference: number;
  tTest: number;
  significance: 'significant' | 'not-significant' | 'not-applicable';
  remark: string;
  remarkType: RemarkType;
}

interface RepeatDifferenceStats {
  subject: string;
  repeatMean: number;
  nonRepeatMean: number;
  repeatStdDev: number;
  nonRepeatStdDev: number;
  difference: number;
  tTest: number;
  significance: 'significant' | 'not-significant' | 'not-applicable';
  remark: string;
  remarkType: RemarkType;
}

//#endregion

//#region get functions
const getCurrentYear = () => {
    return new Date().getFullYear();
  };

const getRemark = (mean: number, stdDev: number): { remark: string; type: RemarkType } => {
  if (mean === 0 && stdDev === 0) return { remark: 'لم تدرس', type: 'secondary' };
  if (mean >= 15 && stdDev <= 3) return { remark: 'أداء ممتاز', type: 'success' };
  if (mean >= 15 && stdDev > 3) return { remark: 'أداء ممتاز ولكنه غير مستقر', type: 'warning' };
  if (mean >= 10 && mean < 15 && stdDev <= 3) return { remark: 'أداء جيد وثابت', type: 'success' };
  if (mean >= 10 && mean < 15 && stdDev > 3) return { remark: 'أداء جيد لكنه متنوع', type: 'warning' };
  if (mean >= 5 && mean < 10 && stdDev <= 3) return { remark: 'أداء ضعيف لكنه ثابت', type: 'info' };
  if (mean >= 5 && mean < 10 && stdDev > 3) return { remark: 'أداء ضعيف وغير مستقر', type: 'warning' };
  if (mean < 5 && mean >= 0.01 && stdDev <= 3) return { remark: 'أداء ضعيف جداً لكنه ثابت', type: 'danger' };
  if (mean < 5 && mean >= 0.01 && stdDev > 3) return { remark: 'أداء ضعيف جداً وغير مستقر', type: 'danger' };
  return { remark: 'لم تدرس', type: 'secondary' };
};

const getRemarkTypeClass = (type: RemarkType): string => {
  switch (type) {
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    case 'danger':
      return 'bg-red-100 text-red-800';
    case 'info':
      return 'bg-blue-100 text-blue-800';
    case 'secondary':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
//#endregion

//#region Custom hooks
// Subject lists by term
const subjectsByTerm: Record<string, string[]> = {
  'الفصل الأول': [
    'اللغة العربية ف 1', 'اللغة الأمازيغية ف 1', 'اللغة الفرنسية ف 1', 'اللغة الإنجليزية ف 1', 'التربية الإسلامية ف 1',
    'التربية المدنية ف 1', 'التاريخ والجغرافيا ف 1', 'الرياضيات ف 1', 'ع الطبيعة و الحياة ف 1', 'ع الفيزيائية والتكنولوجيا ف 1', 'المعلوماتية ف 1',
    'التربية التشكيلية ف 1', 'التربية الموسيقية ف 1', 'ت البدنية و الرياضية ف 1', 'المعدل السنوي', 'معدل ش ت م'
  ],
  'الفصل الثاني': [
    'اللغة العربية ف 2', 'اللغة الأمازيغية ف 2', 'اللغة الفرنسية ف 2', 'اللغة الإنجليزية ف 2', 'التربية الإسلامية ف 2',
    'التربية المدنية ف 2', 'التاريخ والجغرافيا ف 2', 'الرياضيات ف 2', 'ع الطبيعة و الحياة ف 2', 'ع الفيزيائية والتكنولوجيا ف 2', 'المعلوماتية ف 2',
    'التربية التشكيلية ف 2', 'التربية الموسيقية ف 2', 'ت البدنية و الرياضية ف 2', 'المعدل السنوي', 'معدل ش ت م'
  ],
  'الفصل الثالث': [
    'اللغة العربية ف 3', 'اللغة الأمازيغية ف 3', 'اللغة الفرنسية ف 3', 'اللغة الإنجليزية ف 3', 'التربية الإسلامية ف 3',
    'التربية المدنية ف 3', 'التاريخ والجغرافيا ف 3', 'الرياضيات ف 3', 'ع الطبيعة و الحياة ف 3', 'ع الفيزيائية والتكنولوجيا ف 3', 'المعلوماتية ف 3',
    'التربية التشكيلية ف 3', 'التربية الموسيقية ف 3', 'ت البدنية و الرياضية ف 3', 'المعدل السنوي', 'معدل ش ت م'
  ],
  'المعدلات السنوية': [
    'اللغة العربية م س', 'اللغة الأمازيغية م س', 'اللغة الفرنسية م س', 'اللغة الإنجليزية م س', 'التربية الإسلامية م س',
    'التربية المدنية م س', 'التاريخ والجغرافيا م س', 'الرياضيات م س', 'ع الطبيعة و الحياة م س', 'ع الفيزيائية والتكنولوجيا م س', 'المعلوماتية م س',
    'التربية التشكيلية م س', 'التربية الموسيقية م س', 'ت البدنية و الرياضية م س', 'المعدل السنوي', 'معدل ش ت م'
  ],
};

// Custom hooks with dynamic subjects

const useGenderStats = (data: Student[], subjectTerm: string) => {
  return useMemo(() => {
    const maleData = data.filter(student => student['الجنس'] === 'ذكر');
    const femaleData = data.filter(student => student['الجنس'] === 'أنثى');
    const subjects = subjectsByTerm[subjectTerm] || subjectsByTerm['المعدلات السنوية'];
    const calculateStats = (studentData: Student[]) => {
      return subjects.map(subject => {
        const grades = studentData
          .filter(student => typeof student[subject] === "number" && student[subject] >= 0.01)
          .map(student => student[subject]);
        const mean = calculateMean(grades);
        const stdDev = calculateStdDev(grades, mean);
        const variance = calculateVariance(grades, mean);
        const range = calculateRange(grades);
        const median = calculateMedian(grades);
        const { remark, type } = getRemark(mean, stdDev);
        return {
          subject,
          presentCount: grades.length,
          mean: Number(mean.toFixed(2)),
          stdDev: Number(stdDev.toFixed(2)),
          median: Number(median.toFixed(2)),
          range: Number(range.toFixed(2)),
          variance: Number(variance.toFixed(2)),
          remark,
          remarkType: type
        };
      });
    };
    return {
      male: calculateStats(maleData),
      female: calculateStats(femaleData)
    };
  }, [data, subjectTerm]);
};

const useRepeatStats = (data: Student[], subjectTerm: string) => {
  return useMemo(() => {
    const repeatData = data.filter(student => student['الإعادة'] === 'نعم');
    const nonRepeatData = data.filter(student => student['الإعادة'] === 'لا');
    const subjects = subjectsByTerm[subjectTerm] || subjectsByTerm['المعدلات السنوية'];
    const calculateStats = (studentData: Student[]) => {
      return subjects.map(subject => {
        const grades = studentData
          .filter(student => typeof student[subject] === "number" && student[subject] >= 0.01)
          .map(student => student[subject]);
        const mean = calculateMean(grades);
        const stdDev = calculateStdDev(grades, mean);
        const variance = calculateVariance(grades, mean);
        const range = calculateRange(grades);
        const median = calculateMedian(grades);
        const { remark, type } = getRemark(mean, stdDev);
        return {
          subject,
          presentCount: grades.length,
          mean: Number(mean.toFixed(2)),
          stdDev: Number(stdDev.toFixed(2)),
          median: Number(median.toFixed(2)),
          range: Number(range.toFixed(2)),
          variance: Number(variance.toFixed(2)),
          remark,
          remarkType: type
        };
      });
    };
    return {
      repeat: calculateStats(repeatData),
      nonRepeat: calculateStats(nonRepeatData)
    };
  }, [data, subjectTerm]);
};
//#endregion

//#region utility (calculate) functions
// Mean
const calculateMean = (grades: number[]): number => {
  if (grades.length === 0) return 0;
  return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
};

// Variance
const calculateVariance = (grades: number[], mean: number): number => {
  if (grades.length === 0) return 0;
  const squareDiffs = grades.map(grade => Math.pow(grade - mean, 2));
  return squareDiffs.reduce((sum, diff) => sum + diff, 0) / grades.length;
};

// Standard Deviation
const calculateStdDev = (grades: number[], mean: number): number => {
  if (grades.length === 0) return 0;
  const squareDiffs = grades.map(grade => Math.pow(grade - mean, 2));
  return Math.sqrt(squareDiffs.reduce((sum, diff) => sum + diff, 0) / grades.length);
};

// Range
const calculateRange = (grades: number[]): number => {
  if (grades.length === 0) return 0;
  const min = Math.min(...grades);
  const max = Math.max(...grades);
  return max - min;
};

// Median
const calculateMedian = (grades: number[]): number => {
  if (grades.length === 0) return 0;
  const sorted = [...grades].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    return sorted[mid];
  }
};

const calculateGenderDifferences = (data: Student[]): GenderDifferenceStats[] => {
  const subjects = [
    'اللغة العربية م س', 'اللغة الأمازيغية م س', 'اللغة الفرنسية م س', 'اللغة الإنجليزية م س', 'التربية الإسلامية م س',
    'التربية المدنية م س', 'التاريخ والجغرافيا م س', 'الرياضيات م س', 'ع الطبيعة و الحياة م س', 'ع الفيزيائية والتكنولوجيا م س', 'المعلوماتية م س',
    'التربية التشكيلية م س', 'التربية الموسيقية م س', 'ت البدنية و الرياضية م س', 'المعدل السنوي', 'معدل ش ت م'
  ];

  return subjects.map(subject => {
    const maleGrades = data
      .filter(student => student['الجنس'] === 'ذكر' && student[subject] >= 0.01)
      .map(student => student[subject]);

    const femaleGrades = data
      .filter(student => student['الجنس'] === 'أنثى' && student[subject] >= 0.01)
      .map(student => student[subject]);

    const n1 = maleGrades.length;
    const n2 = femaleGrades.length;

    // ➤ إذا لم توجد بيانات كافية للمقارنة
    if (n1 === 0 || n2 === 0) {
      return {
        subject,
        maleMean: 0,
        femaleMean: 0,
        maleStdDev: 0,
        femaleStdDev: 0,
        difference: 0,
        tTest: 0,
        significance: 'not-applicable',
        remark: 'لا تُدرّس',
        remarkType: 'secondary'
      };
    }

    const maleMean = calculateMean(maleGrades);
    const femaleMean = calculateMean(femaleGrades);
    const maleStdDev = calculateStdDev(maleGrades, maleMean);
    const femaleStdDev = calculateStdDev(femaleGrades, femaleMean);

    const denominator = Math.sqrt((maleStdDev ** 2 / n1) + (femaleStdDev ** 2 / n2));
    let tTest = 0;
    if (denominator !== 0) {
      tTest = Math.abs((maleMean - femaleMean) / denominator);
    }

    const difference = Math.abs(maleMean - femaleMean);
    const significance = tTest > 1.96 ? 'significant' : 'not-significant';

    let remark = '';
    let remarkType: RemarkType = 'secondary';

    if (significance === 'significant') {
      if (maleMean > femaleMean) {
        remark = 'تفوق الذكور بشكل ملحوظ';
        remarkType = 'info';
      } else {
        remark = 'تفوق الإناث بشكل ملحوظ';
        remarkType = 'success';
      }
    } else {
      remark = 'لا يوجد فرق ذو دلالة إحصائية';
      remarkType = 'secondary';
    }

    return {
      subject,
      maleMean: Number(maleMean.toFixed(2)),
      femaleMean: Number(femaleMean.toFixed(2)),
      maleStdDev: Number(maleStdDev.toFixed(2)),
      femaleStdDev: Number(femaleStdDev.toFixed(2)),
      difference: Number(difference.toFixed(2)),
      tTest: Number(tTest.toFixed(2)),
      significance,
      remark,
      remarkType
    };
  });
};

const calculateRepeatDifferences = (data: Student[]): RepeatDifferenceStats[] => {
  const subjects = [
    'اللغة العربية م س', 'اللغة الأمازيغية م س', 'اللغة الفرنسية م س', 'اللغة الإنجليزية م س', 'التربية الإسلامية م س',
    'التربية المدنية م س', 'التاريخ والجغرافيا م س', 'الرياضيات م س', 'ع الطبيعة و الحياة م س', 'ع الفيزيائية والتكنولوجيا م س', 'المعلوماتية م س',
    'التربية التشكيلية م س', 'التربية الموسيقية م س', 'ت البدنية و الرياضية م س', 'المعدل السنوي', 'معدل ش ت م'
  ];

  return subjects.map(subject => {
    const repeatGrades = data
      .filter(student => student['الإعادة'] === 'نعم' && student[subject] >= 0.01)
      .map(student => student[subject]);
    
    const nonRepeatGrades = data
      .filter(student => student['الإعادة'] === 'لا' && student[subject] >= 0.01)
      .map(student => student[subject]);

    const n1 = repeatGrades.length;
    const n2 = nonRepeatGrades.length;

    // ➤ في حالة عدم وجود بيانات للمعيدين أو غير المعيدين
    if (n1 === 0 || n2 === 0) {
      return {
        subject,
        repeatMean: 0,
        nonRepeatMean: 0,
        repeatStdDev: 0,
        nonRepeatStdDev: 0,
        difference: 0,
        tTest: 0,
        significance: 'not-applicable',
        remark: 'لا تُدرّس',
        remarkType: 'secondary'
      };
    }

    const repeatMean = calculateMean(repeatGrades);
    const nonRepeatMean = calculateMean(nonRepeatGrades);
    const repeatStdDev = calculateStdDev(repeatGrades, repeatMean);
    const nonRepeatStdDev = calculateStdDev(nonRepeatGrades, nonRepeatMean);

    let tTest = 0;
    const denominator = Math.sqrt((repeatStdDev ** 2 / n1) + (nonRepeatStdDev ** 2 / n2));
    if (denominator !== 0) {
      tTest = Math.abs((repeatMean - nonRepeatMean) / denominator);
    }

    const significance = tTest > 1.96 ? 'significant' : 'not-significant';
    const difference = Math.abs(repeatMean - nonRepeatMean);

    let remark = '';
    let remarkType: RemarkType = 'secondary';

    if (significance === 'significant') {
      if (repeatMean > nonRepeatMean) {
        remark = 'تفوق المعيدين بشكل ملحوظ';
        remarkType = 'info';
      } else {
        remark = 'تفوق غير المعيدين بشكل ملحوظ';
        remarkType = 'info';
      }
    } else {
      remark = 'لا يوجد فرق ذو دلالة إحصائية';
      remarkType = 'secondary';
    }

    return {
      subject,
      repeatMean: Number(repeatMean.toFixed(2)),
      nonRepeatMean: Number(nonRepeatMean.toFixed(2)),
      repeatStdDev: Number(repeatStdDev.toFixed(2)),
      nonRepeatStdDev: Number(nonRepeatStdDev.toFixed(2)),
      difference: Number(difference.toFixed(2)),
      tTest: Number(tTest.toFixed(2)),
      significance,
      remark,
      remarkType
    };
  });
};

//#endregion

const certificateSubjectMap: Record<string, string> = {
  'اللغة العربية': 'العربية ش ت م',
  'اللغة الأمازيغية': 'الأمازيغية ش ت م',
  'اللغة الفرنسية': 'الفرنسية ش ت م',
  'اللغة الإنجليزية': 'الإنجليزية ش ت م',
  'التربية الإسلامية': 'ت إسلامية ش ت م',
  'التربية المدنية': 'ت مدنية ش ت م',
  'التاريخ والجغرافيا': 'تاريخ جغرافيا ش ت م',
  'الرياضيات': 'رياضيات ش ت م',
  'ع الطبيعة و الحياة': 'علوم ط ش ت م',
  'ع الفيزيائية والتكنولوجيا': 'فيزياء ش ت م',
  'المعلوماتية': 'معلوماتية ش ت م',
  'التربية التشكيلية': 'ت تشكيلية ش ت م',
  'التربية الموسيقية': 'ت موسيقية ش ت م',
  'ت البدنية و الرياضية': 'ت بدنية ش ت م',
  'المعدل': 'معدل ش ت م',
};

const S1SubjectMap: Record<string, string> = {
  'اللغة العربية': 'اللغة العربية ف 1',
  'اللغة الأمازيغية': 'اللغة الأمازيغية ف 1',
  'اللغة الفرنسية': 'اللغة الفرنسية ف 1',
  'اللغة الإنجليزية': 'اللغة الإنجليزية ف 1',
  'التربية الإسلامية': 'التربية الإسلامية ف 1',
  'التربية المدنية': 'التربية المدنية ف 1',
  'التاريخ والجغرافيا': 'التاريخ والجغرافيا ف 1',
  'الرياضيات': 'الرياضيات ف 1',
  'ع الطبيعة و الحياة': 'ع الطبيعة و الحياة ف 1',
  'ع الفيزيائية والتكنولوجيا': 'ع الفيزيائية والتكنولوجيا ف 1',
  'المعلوماتية': 'المعلوماتية ف 1',
  'التربية التشكيلية': 'التربية التشكيلية ف 1',
  'التربية الموسيقية': 'التربية الموسيقية ف 1',
  'ت البدنية و الرياضية': 'ت البدنية و الرياضية ف 1',
  'المعدل': 'معدل الفصل 1',
};

const S2SubjectMap: Record<string, string> = {
  'اللغة العربية': 'اللغة العربية ف 2',
  'اللغة الأمازيغية': 'اللغة الأمازيغية ف 2',
  'اللغة الفرنسية': 'اللغة الفرنسية ف 2',
  'اللغة الإنجليزية': 'اللغة الإنجليزية ف 2',
  'التربية الإسلامية': 'التربية الإسلامية ف 2',
  'التربية المدنية': 'التربية المدنية ف 2',
  'التاريخ والجغرافيا': 'التاريخ والجغرافيا ف 2',
  'الرياضيات': 'الرياضيات ف 2',
  'ع الطبيعة و الحياة': 'ع الطبيعة و الحياة ف 2',
  'ع الفيزيائية والتكنولوجيا': 'ع الفيزيائية والتكنولوجيا ف 2',
  'المعلوماتية': 'المعلوماتية ف 2',
  'التربية التشكيلية': 'التربية التشكيلية ف 2',
  'التربية الموسيقية': 'التربية الموسيقية ف 2',
  'ت البدنية و الرياضية': 'ت البدنية و الرياضية ف 2',
  'المعدل': 'معدل الفصل 2',
};

const S3SubjectMap: Record<string, string> = {
  'اللغة العربية': 'اللغة العربية ف 3',
  'اللغة الأمازيغية': 'اللغة الأمازيغية ف 3',
  'اللغة الفرنسية': 'اللغة الفرنسية ف 3',
  'اللغة الإنجليزية': 'اللغة الإنجليزية ف 3',
  'التربية الإسلامية': 'التربية الإسلامية ف 3',
  'التربية المدنية': 'التربية المدنية ف 3',
  'التاريخ والجغرافيا': 'التاريخ والجغرافيا ف 3',
  'الرياضيات': 'الرياضيات ف 3',
  'ع الطبيعة و الحياة': 'ع الطبيعة و الحياة ف 3',
  'ع الفيزيائية والتكنولوجيا': 'ع الفيزيائية والتكنولوجيا ف 3',
  'المعلوماتية': 'المعلوماتية ف 3',
  'التربية التشكيلية': 'التربية التشكيلية ف 3',
  'التربية الموسيقية': 'التربية الموسيقية ف 3',
  'ت البدنية و الرياضية': 'ت البدنية و الرياضية ف 3',
  'المعدل': 'معدل الفصل 3',
};

const AnnualSubjectMap: Record<string, string> = {
  'اللغة العربية': 'اللغة العربية م س',
  'اللغة الأمازيغية': 'اللغة الأمازيغية م س',
  'اللغة الفرنسية': 'اللغة الفرنسية م س',
  'اللغة الإنجليزية': 'اللغة الإنجليزية م س',
  'التربية الإسلامية': 'التربية الإسلامية م س',
  'التربية المدنية': 'التربية المدنية م س',
  'التاريخ والجغرافيا': 'التاريخ والجغرافيا م س',
  'الرياضيات': 'الرياضيات م س',
  'ع الطبيعة و الحياة': 'ع الطبيعة و الحياة م س',
  'ع الفيزيائية والتكنولوجيا': 'ع الفيزيائية والتكنولوجيا م س',
  'المعلوماتية': 'المعلوماتية م س',
  'التربية التشكيلية': 'التربية التشكيلية م س',
  'التربية الموسيقية': 'التربية الموسيقية م س',
  'ت البدنية و الرياضية': 'ت البدنية و الرياضية م س',
  'المعدل': 'المعدل السنوي',
};

const reverseCertificateSubjectMap: Record<string, string> = Object.fromEntries(
  Object.entries(certificateSubjectMap).map(([k, v]) => [v, k])
);

// Unified subject mapping function
function getSubjectField(baseSubject: string, term: string): string {
  if (term === 'الفصل الأول') return S1SubjectMap[baseSubject] || baseSubject;
  if (term === 'الفصل الثاني') return S2SubjectMap[baseSubject] || baseSubject;
  if (term === 'الفصل الثالث') return S3SubjectMap[baseSubject] || baseSubject;
  if (term === 'المعدلات السنوية') return AnnualSubjectMap[baseSubject] || baseSubject;
  if (term === 'معدلات الشهادة') return certificateSubjectMap[baseSubject] || baseSubject;
  return baseSubject;
}

// Function to get base subject name regardless of term
function getBaseSubject(subject: string, term: string): string {
  if (term === 'معدلات الشهادة') {
    return reverseCertificateSubjectMap[subject] || subject;
  }
  return subject
    .replace(/ ف [123]$/, '')
    .replace(/ م س$/, '')
    .replace(/ ش ت م$/, '')
    .replace(/ السنوي$/, '');
}

//#region Table Components
//--------------------------------------------------------------------------
// ✅ Subject Stats Table Diffrence
interface SubjectStatsTableDiffrenceProps {
  data: Student[];
  termA: string;
  termB: string;
  isDarkMode: boolean;
}
const SubjectStatsTable: React.FC<SubjectStatsTableDiffrenceProps> = ({ data, termA, termB, isDarkMode }) => {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  // Helper to extract value from subject item
  const getSubjectValue = (subject: string | { value: string }) =>
    typeof subject === 'string' ? subject : subject.value;

  // Collect all possible base subjects from both terms
  const getAllBaseSubjects = (): string[] => {
    const allSubjects = new Set<string>();
    subjectsByTerm[termA]?.forEach(s => allSubjects.add(getBaseSubject(getSubjectValue(s), termA)));
    subjectsByTerm[termB]?.forEach(s => allSubjects.add(getBaseSubject(getSubjectValue(s), termB)));
    return Array.from(allSubjects);
  };

  const baseSubjects = getAllBaseSubjects();

  const stats = useMemo(() => {
    return baseSubjects.map(baseSubject => {
      const fieldA = getSubjectField(baseSubject, termA);
      const fieldB = getSubjectField(baseSubject, termB);

      const gradesA = data.filter(student => typeof student[fieldA] === 'number' && student[fieldA] >= 0.01).map(student => student[fieldA]);
      const gradesB = data.filter(student => typeof student[fieldB] === 'number' && student[fieldB] >= 0.01).map(student => student[fieldB]);

      const meanA = calculateMean(gradesA);
      const stdDevA = calculateStdDev(gradesA, meanA);
      const meanB = calculateMean(gradesB);
      const stdDevB = calculateStdDev(gradesB, meanB);
      const difference = Math.abs(meanA - meanB);

      const nA = gradesA.length;
      const nB = gradesB.length;
      let tTest = 0;
      let significance = 'not-applicable';
      let remark = '';
      let remarkType: RemarkType = 'secondary';

      if (nA > 0 && nB > 0) {
        const denominator = Math.sqrt((stdDevA ** 2 / nA) + (stdDevB ** 2 / nB));
        if (denominator !== 0) {
          tTest = Math.abs((meanA - meanB) / denominator);
          significance = tTest > 1.96 ? 'significant' : 'not-significant';
        }
      }

      if (nA === 0 && nB === 0) {
        remark = 'لا توجد بيانات';
        remarkType = 'secondary';
      } else if (significance === 'significant') {
        if (meanA > meanB) {
          remark = 'تفوق نتائج ' + termA;
          remarkType = 'success';
        } else {
          remark = 'تفوق نتائج ' + termB;
          remarkType = 'info';
        }
      } else if (significance === 'not-significant') {
        remark = 'لا يوجد فرق ذو دلالة إحصائية';
        remarkType = 'secondary';
      }

      return {
        subject: baseSubject,
        fieldA,
        fieldB,
        meanA: meanA.toFixed(2),
        stdDevA: stdDevA.toFixed(2),
        meanB: meanB.toFixed(2),
        stdDevB: stdDevB.toFixed(2),
        difference: difference.toFixed(2),
        tTest: tTest.toFixed(2),
        remark,
        remarkType,
        hasData: nA > 0 || nB > 0
      };
    }).filter(stat => stat.hasData);
  }, [data, termA, termB, baseSubjects]);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id='subjectStatsDiffTitle' className="table-title text-xl font-semibold">
          تحليل النتائج المقارن بين {termA} و {termB}
        </h2>
        <div className="flex gap-2">
          <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-gray-300 cursor-not-allowed opacity-50"
            disabled
            title="التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(true)}
            className="p-2 text-gray-300 cursor-not-allowed opacity-50"
            disabled
            title="عرض الرسم البياني"
          >
            <BarChart2 className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => printTable('subjectStatsTable', 'subjectStatsDiffTitle')}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel('subjectStatsTable')}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table id="subjectStatsTable" className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          {/* Table headers */}
          <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <tr>
              <th className="px-6 py-6 text-center text-sm font-bold" rowSpan={2}>المادة</th>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" colSpan={2}>{termA}</th>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" colSpan={2}>{termB}</th>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" rowSpan={2}>الفرق</th>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" rowSpan={2}>اختبار ت</th>
              <th className="px-6 py-6 text-center text-sm font-bold" rowSpan={2}>الملاحظة</th>
            </tr>
            <tr>
              <th className="px-6 py-6 text-center text-sm font-bold">المتوسط الحسابي</th>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100">الانحراف المعياري</th>
              <th className="px-6 py-6 text-center text-sm font-bold">المتوسط الحسابي</th>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100">الانحراف المعياري</th>
            </tr>
          </thead>
          
          {/* Table body */}
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
            {stats.map((row) => (
              <tr key={row.subject}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{row.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{row.meanA}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100">{row.stdDevA}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{row.meanB}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100">{row.stdDevB}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100">{row.difference}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100">{row.tTest}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <span className={`px-2 inline-flex text-sm leading-8 font-semibold rounded-md ${getRemarkTypeClass(row.remarkType)}`}>
                    {row.remark}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};
//--------------------------------------------------------------------------
// ✅ Grade Distribution Table Diffrence
interface GradeDistributionTableDiffrenceProps {
  data: Student[];
  termA: string;
  termB: string;
  isDarkMode: boolean;
}
const GradeDistributionTable: React.FC<GradeDistributionTableDiffrenceProps> = ({ data, termA, termB, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'above10' | 'between8And10' | 'below8'>('above10');
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  const handlePrint = () => {
    if (activeTab === 'above10') {
      printTable('gradeDistributionDiffTableAbove10', 'gradeDistributionDiffTitle');
    } else if (activeTab === 'between8And10') {
      printTable('gradeDistributionDiffTableBetween8And10', 'gradeDistributionDiffTitle');
    } else if (activeTab === 'below8') {
      printTable('gradeDistributionDiffTableBelow8', 'gradeDistributionDiffTitle');
    }
  };

  const getSubjectValue = (subject: string | { value: string }) =>
    typeof subject === 'string' ? subject : subject.value;

  // Collect all possible base subjects from both terms
  const getAllBaseSubjects = (): string[] => {
    const allSubjects = new Set<string>();
    subjectsByTerm[termA]?.forEach(s => allSubjects.add(getBaseSubject(getSubjectValue(s), termA)));
    subjectsByTerm[termB]?.forEach(s => allSubjects.add(getBaseSubject(getSubjectValue(s), termB)));
    return Array.from(allSubjects);
  };

  // Calculate distribution for a specific grade range
  const calculateRangeDistribution = (range: 'above10' | 'between8And10' | 'below8') => {
  const baseSubjects = getAllBaseSubjects();
  
  return baseSubjects.map(baseSubject => {
    const fieldA = getSubjectField(baseSubject, termA);
    const fieldB = getSubjectField(baseSubject, termB);

    // Filter students with valid grades in each term
    const studentsWithGradesA = data.filter(student => typeof student[fieldA] === 'number' && student[fieldA] >= 0.01);
    const studentsWithGradesB = data.filter(student => typeof student[fieldB] === 'number' && student[fieldB] >= 0.01);

    // Check if subject has data in either term
    const hasData = studentsWithGradesA.length > 0 || studentsWithGradesB.length > 0;
    if (!hasData) return null;

    // Calculate counts for current range
    const termACount = studentsWithGradesA.filter(student => {
      const grade = student[fieldA];
      if (range === 'above10') return grade >= 10;
      if (range === 'between8And10') return grade >= 8 && grade < 10;
      return grade < 8 && grade > 0.01;
    }).length;

    const termBCount = studentsWithGradesB.filter(student => {
      const grade = student[fieldB];
      if (range === 'above10') return grade >= 10;
      if (range === 'between8And10') return grade >= 8 && grade < 10;
      return grade < 8 && grade > 0.01;
    }).length;

    const totalA = studentsWithGradesA.length;
    const totalB = studentsWithGradesB.length;

    const percentageA = totalA > 0 ? ((termACount / totalA) * 100).toFixed(2) : '0.00';
    const percentageB = totalB > 0 ? ((termBCount / totalB) * 100).toFixed(2) : '0.00';
    const difference = Math.abs(parseFloat(percentageA) - parseFloat(percentageB)).toFixed(2);

    let remark = '';
    let remarkType: RemarkType = 'secondary';

    if (termACount > termBCount) {
      remark = `زيادة في ${termA}`;
      remarkType = 'success';
    } else if (termBCount > termACount) {
      remark = `زيادة في ${termB}`;
      remarkType = 'danger';
    } else if (termACount === termBCount && (termACount > 0 || termBCount > 0)) {
      remark = 'لا يوجد فرق';
      remarkType = 'secondary';
    } else {
      remark = 'لا توجد بيانات';
      remarkType = 'secondary';
    }

    return {
      subject: baseSubject,
      termACount,
      termAPercentage: percentageA,
      termBCount,
      termBPercentage: percentageB,
      difference,
      remark,
      remarkType,
      hasData: true
    };
  }).filter(stat => stat !== null); // Remove null entries (subjects without data)
};

  const above10Distribution = useMemo(() => calculateRangeDistribution('above10'), [data, termA, termB]);
  const between8And10Distribution = useMemo(() => calculateRangeDistribution('between8And10'), [data, termA, termB]);
  const below8Distribution = useMemo(() => calculateRangeDistribution('below8'), [data, termA, termB]);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id='gradeDistributionDiffTitle' className="table-title text-xl font-semibold">
          مقارنة توزيع الدرجات بين {termA} و {termB} | 
          {activeTab === 'above10'
            ? ' الدرجات أكبر أو تساوي 10'
            : activeTab === 'between8And10'
            ? ' الدرجات من 8 إلى 9.99'
            : ' الدرجات أقل من 8'}
        </h2>
        <div className="flex gap-2">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-gray-300 cursor-not-allowed opacity-50"
            disabled
            title="التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(true)}
            className="p-2 text-gray-300 cursor-not-allowed opacity-50"
            disabled
            title="عرض الرسم البياني"
          >
            <BarChart2 className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={handlePrint}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel('gradeDistributionDiffTable')}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="w-full max-w-3xl mx-auto">
        <nav className="flex w-full border-b border-gray-200">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('above10')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'above10'
                ? 'border-green-500 text-green-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            الدرجات أكبر أو تساوي 10
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('between8And10')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'between8And10'
                ? 'border-yellow-500 text-yellow-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            الدرجات من 8 إلى 9.99
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('below8')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'below8'
                ? 'border-red-500 text-red-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            الدرجات أقل من 8
          </motion.button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        <div className={activeTab === 'above10' ? '' : 'hidden'}>
          {/* table structure for above10 */}
          <div className="overflow-x-auto">
            <table id="gradeDistributionDiffTableAbove10" className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <tr>
                  <th className="px-6 py-6 text-center text-sm font-bold" rowSpan={2}>المادة</th>
                  <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" colSpan={2}>{termA}</th>
                  <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" colSpan={2}>{termB}</th>
                  <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" rowSpan={2}>الفرق</th>
                  <th className="px-6 py-6 text-center text-sm font-bold" rowSpan={2}>ملاحظة</th>
                </tr>
                <tr>
                  <th className="px-6 py-6 text-center text-sm font-bold">العدد</th>
                  <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100">النسبة</th>
                  <th className="px-6 py-6 text-center text-sm font-bold">العدد</th>
                  <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100">النسبة</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
                {above10Distribution.map((dist, index) => (
                  <tr key={index}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.subject}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.termACount}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.termAPercentage}%</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.termBCount}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.termBPercentage}%</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.difference}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`px-2 inline-flex text-sm leading-8 font-semibold rounded-md ${getRemarkTypeClass(dist.remarkType)}`}>
                        {dist.remark}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={activeTab === 'between8And10' ? '' : 'hidden'}>
          {/* table structure for between8And10 */}
          <div className="overflow-x-auto">
            <table id="gradeDistributionDiffTableBetween8And10" className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <tr>
                  <th className="px-6 py-6 text-center text-sm font-bold" rowSpan={2}>المادة</th>
                  <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" colSpan={2}>{termA}</th>
                  <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" colSpan={2}>{termB}</th>
                  <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" rowSpan={2}>الفرق</th>
                  <th className="px-6 py-6 text-center text-sm font-bold" rowSpan={2}>ملاحظة</th>
                </tr>
                <tr>
                  <th className="px-6 py-6 text-center text-sm font-bold">العدد</th>
                  <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100">النسبة</th>
                  <th className="px-6 py-6 text-center text-sm font-bold">العدد</th>
                  <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100">النسبة</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
                {between8And10Distribution.map((dist, index) => (
                  <tr key={index}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.subject}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.termACount}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.termAPercentage}%</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.termBCount}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.termBPercentage}%</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.difference}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`px-2 inline-flex text-sm leading-8 font-semibold rounded-md ${getRemarkTypeClass(dist.remarkType)}`}>
                        {dist.remark}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={activeTab === 'below8' ? '' : 'hidden'}>
          {/* table structure for below8 */}
          <div className="overflow-x-auto">
            <table id="gradeDistributionDiffTableBelow8" className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <tr>
                  <th className="px-6 py-6 text-center text-sm font-bold" rowSpan={2}>المادة</th>
                  <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" colSpan={2}>{termA}</th>
                  <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" colSpan={2}>{termB}</th>
                  <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" rowSpan={2}>الفرق</th>
                  <th className="px-6 py-6 text-center text-sm font-bold" rowSpan={2}>ملاحظة</th>
                </tr>
                <tr>
                  <th className="px-6 py-6 text-center text-sm font-bold">العدد</th>
                  <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100">النسبة</th>
                  <th className="px-6 py-6 text-center text-sm font-bold">العدد</th>
                  <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100">النسبة</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
                {below8Distribution.map((dist, index) => (
                  <tr key={index}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.subject}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.termACount}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.termAPercentage}%</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.termBCount}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.termBPercentage}%</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.difference}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`px-2 inline-flex text-sm leading-8 font-semibold rounded-md ${getRemarkTypeClass(dist.remarkType)}`}>
                        {dist.remark}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Analysis and Chart components would go here */}
    </div>
  );
};
//--------------------------------------------------------------------------
// ✅ Subject Pass Table Diffrence
interface SubjectPassTableDiffrenceProps {
  data: Student[];
  termA: string;
  termB: string;
  isDarkMode: boolean;
}
const SubjectPassTable: React.FC<SubjectPassTableDiffrenceProps> = ({ data, termA, termB, isDarkMode }) => {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  // Helper to extract value from subject item
  const getSubjectValue = (subject: string | { value: string }) =>
    typeof subject === 'string' ? subject : subject.value;

  // Collect all possible base subjects from both terms
  const getAllBaseSubjects = (): string[] => {
    const allSubjects = new Set<string>();
    subjectsByTerm[termA]?.forEach(s => allSubjects.add(getBaseSubject(getSubjectValue(s), termA)));
    subjectsByTerm[termB]?.forEach(s => allSubjects.add(getBaseSubject(getSubjectValue(s), termB)));
    return Array.from(allSubjects);
  };

  const baseSubjects = getAllBaseSubjects();

  const stats = useMemo(() => {
    return baseSubjects.map(baseSubject => {
      const fieldA = getSubjectField(baseSubject, termA);
      const fieldB = getSubjectField(baseSubject, termB);

      // Calculate pass counts and percentages for term A
      const passCountA = data.filter(student => typeof student[fieldA] === 'number' && student[fieldA] >= 10).length;
      const totalCountA = data.filter(student => typeof student[fieldA] === 'number' && student[fieldA] >= 0.01).length;
      const passPercentageA = totalCountA > 0 ? (passCountA / totalCountA) * 100 : 0;

      // Calculate pass counts and percentages for term B
      const passCountB = data.filter(student => typeof student[fieldB] === 'number' && student[fieldB] >= 10).length;
      const totalCountB = data.filter(student => typeof student[fieldB] === 'number' && student[fieldB] >= 0.01).length;
      const passPercentageB = totalCountB > 0 ? (passCountB / totalCountB) * 100 : 0;

      // Calculate difference in pass percentages
      const difference = Math.abs(passPercentageA - passPercentageB);

      // Determine significance and remarks
      let remark = '';
      let remarkType: RemarkType = 'secondary';

      if (totalCountA === 0 && totalCountB === 0) {
        remark = 'لا توجد بيانات';
        remarkType = 'secondary';
      } else if (passPercentageA > passPercentageB) {
        remark = 'تفوق نتائج ' + termA;
        remarkType = 'success';
      } else if (passPercentageB > passPercentageA) {
        remark = 'تفوق نتائج ' + termB;
        remarkType = 'info';
      } else if (passPercentageA === passPercentageB && (totalCountA > 0 || totalCountB > 0)) {
        remark = 'نفس النسبة';
        remarkType = 'secondary';
      }

      return {
        subject: baseSubject,
        fieldA,
        fieldB,
        passCountA,
        totalCountA,
        passPercentageA: Number(passPercentageA.toFixed(2)),
        passCountB,
        totalCountB,
        passPercentageB: Number(passPercentageB.toFixed(2)),
        difference: Number(difference.toFixed(2)),
        remark,
        remarkType,
        hasData: totalCountA > 0 || totalCountB > 0
      };
    }).filter(stat => stat.hasData);
  }, [data, termA, termB, baseSubjects]);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id='subjectPassDiffTitle' className="table-title text-xl font-semibold">
          مقارنة نسب النجاح بين {termA} و {termB}
        </h2>
        <div className="flex gap-2">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-gray-300 cursor-not-allowed opacity-50"
            disabled
            title="التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(true)}
            className="p-2 text-gray-300 cursor-not-allowed opacity-50"
            disabled
            title="عرض الرسم البياني"
          >
            <BarChart2 className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => printTable('subjectPassDiffTable', 'subjectPassDiffTitle')}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel('subjectPassDiffTable')}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table id="subjectPassDiffTable" className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <tr>
              <th className="px-6 py-6 text-center text-sm font-bold" rowSpan={2}>المادة</th>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" colSpan={3}>{termA}</th>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" colSpan={3}>{termB}</th>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" rowSpan={2}>الفرق</th>
              <th className="px-6 py-6 text-center text-sm font-bold" rowSpan={2}>الملاحظة</th>
            </tr>
            <tr>
              <th className="px-6 py-6 text-center text-sm font-bold">عدد الناجحين</th>
              <th className="px-6 py-6 text-center text-sm font-bold">عدد الممتحنين</th>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100">النسبة</th>
              <th className="px-6 py-6 text-center text-sm font-bold">عدد الناجحين</th>
              <th className="px-6 py-6 text-center text-sm font-bold">عدد الممتحنين</th>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100">النسبة</th>
            </tr>
          </thead>
          
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
            {stats.map((row) => (
              <tr key={row.subject}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{row.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{row.passCountA}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{row.totalCountA}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100">{row.passPercentageA}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{row.passCountB}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{row.totalCountB}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100">{row.passPercentageB}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100">{row.difference}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <span className={`px-2 inline-flex text-sm leading-8 font-semibold rounded-md ${getRemarkTypeClass(row.remarkType)}`}>
                    {row.remark}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
//--------------------------------------------------------------------------
// ✅ Gender Stats Table Diffrence
interface GenderStatsTableDiffrenceProps {
  stats: GenderStats
  data: Student[];
  isDarkMode: boolean;
}
const GenderStatsTable: React.FC<GenderStatsTableDiffrenceProps> = ({ isDarkMode, data }) => {
  const [activeTab, setActiveTab] = useState<'male' | 'female'>('male');
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>

      <div className="w-full max-w-3xl mx-auto">
        <nav className="flex w-full border-b border-gray-200">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('male')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'male'
                ? 'border-blue-500 text-blue-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            الذكور
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('female')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'female'
                ? 'border-rose-500 text-rose-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            الإناث
          </motion.button>
        </nav>
      </div>
      <div className="mt-4">
        <div className={activeTab === 'male' ? '' : 'hidden'}>
          <SubjectStatsTable data={data} termA='الفصل الأول' termB='الفصل الثاني' isDarkMode={isDarkMode} />
        </div>
        <div className={activeTab === 'female' ? '' : 'hidden'}>
          <SubjectStatsTable data={data} termA='الفصل الأول' termB='الفصل الثاني' isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};
//--------------------------------------------------------------------------
// ✅ Repeat Stats Table Diffrence
interface RepeatStatsTableDiffrenceProps {
  stats: RepeatStats
  data: Student[];
  isDarkMode: boolean;
}
const RepeatStatsTable: React.FC<RepeatStatsTableDiffrenceProps> = ({ isDarkMode, data }) => {
  const [activeTab, setActiveTab] = useState<'repeat' | 'nonRepeat'>('repeat');
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="w-full max-w-3xl mx-auto">
        <nav className="flex w-full border-b border-gray-200">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('repeat')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'repeat'
                ? 'border-blue-500 text-blue-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            المعيدين
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('nonRepeat')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'nonRepeat'
                ? 'border-rose-500 text-rose-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            غير المعيدين
          </motion.button>
        </nav>
      </div>

      <div className="mt-4">
        <div className={activeTab === 'repeat' ? '' : 'hidden'}>
          <SubjectStatsTable data={data} termA='الفصل الأول' termB='الفصل الثاني' isDarkMode={isDarkMode} />
        </div>
        <div className={activeTab === 'nonRepeat' ? '' : 'hidden'}>
          <SubjectStatsTable data={data} termA='الفصل الأول' termB='الفصل الثاني' isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};
//---------------------------------------------------------------------------
// ✅ Detailed Grade Distribution Table Diffrence
interface DetailedGradeDistributionTableDiffrenceProps {
  data: Student[];
  termA: string;
  termB: string;
  isDarkMode: boolean;
}
const DetailedGradeDistributionTable: React.FC<DetailedGradeDistributionTableDiffrenceProps> = ({ data, termA, termB, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<
    'range0To8' | 'range9To9' | 'range10To11' | 
    'range12To13' | 'range14To15' | 'range16To17' | 'range18To20'
  >('range0To8');
  
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  const handlePrint = () => {
    if (activeTab === 'range0To8') {
      printTable('detailedGradeDistributionDiffTable', 'detailedGradeDistributionDiffTitle');
    } else if (activeTab === 'range9To9') {
      printTable('detailedGradeDistributionDiffTable', 'detailedGradeDistributionDiffTitle');
    } else if (activeTab === 'range10To11') {
      printTable('detailedGradeDistributionDiffTable', 'detailedGradeDistributionDiffTitle');
    } else if (activeTab === 'range12To13') {
      printTable('detailedGradeDistributionDiffTable', 'detailedGradeDistributionDiffTitle');
    } else if (activeTab === 'range14To15') {
      printTable('detailedGradeDistributionDiffTable', 'detailedGradeDistributionDiffTitle');
    } else if (activeTab === 'range16To17') {
      printTable('detailedGradeDistributionDiffTable', 'detailedGradeDistributionDiffTitle');
    } else if (activeTab === 'range18To20') {
      printTable('detailedGradeDistributionDiffTable', 'detailedGradeDistributionDiffTitle');
    }
  };

  // Helper to get the appropriate field name for each term
  const getSubjectField = (baseSubject: string, term: string): string => {
    if (term === 'الفصل الأول') return S1SubjectMap[baseSubject] || baseSubject;
    if (term === 'الفصل الثاني') return S2SubjectMap[baseSubject] || baseSubject;
    if (term === 'الفصل الثالث') return S3SubjectMap[baseSubject] || baseSubject;
    if (term === 'المعدلات السنوية') return AnnualSubjectMap[baseSubject] || baseSubject;
    return certificateSubjectMap[baseSubject] || baseSubject;
  };

  // Helper to extract value from subject item
  const getSubjectValue = (subject: string | { value: string }) =>
    typeof subject === 'string' ? subject : subject.value;

  // Collect all possible base subjects from both terms
  const getAllBaseSubjects = (): string[] => {
    const allSubjects = new Set<string>();
    subjectsByTerm[termA]?.forEach(s => allSubjects.add(getBaseSubject(getSubjectValue(s), termA)));
    subjectsByTerm[termB]?.forEach(s => allSubjects.add(getBaseSubject(getSubjectValue(s), termB)));
    return Array.from(allSubjects);
  };

  // Calculate distribution for a specific grade range
  const calculateRangeDistribution = (
    range: 'range0To8' | 'range9To9' | 'range10To11' | 
           'range12To13' | 'range14To15' | 'range16To17' | 'range18To20'
  ) => {
    const baseSubjects = getAllBaseSubjects();
    
    return baseSubjects.map(baseSubject => {
      const fieldA = getSubjectField(baseSubject, termA);
      const fieldB = getSubjectField(baseSubject, termB);

      // Filter students with valid grades in each term
      const studentsWithGradesA = data.filter(student => typeof student[fieldA] === 'number' && student[fieldA] >= 0.01);
      const studentsWithGradesB = data.filter(student => typeof student[fieldB] === 'number' && student[fieldB] >= 0.01);

      // Check if subject has data in either term
      const hasData = studentsWithGradesA.length > 0 || studentsWithGradesB.length > 0;
      if (!hasData) return null;

      // Calculate counts for current range
      const termACount = studentsWithGradesA.filter(student => {
        const grade = student[fieldA];
        switch(range) {
          case 'range0To8': return grade >= 0 && grade < 8;
          case 'range9To9': return grade >= 9 && grade < 10;
          case 'range10To11': return grade >= 10 && grade < 12;
          case 'range12To13': return grade >= 12 && grade < 14;
          case 'range14To15': return grade >= 14 && grade < 16;
          case 'range16To17': return grade >= 16 && grade < 18;
          case 'range18To20': return grade >= 18 && grade <= 20;
          default: return false;
        }
      }).length;

      const termBCount = studentsWithGradesB.filter(student => {
        const grade = student[fieldB];
        switch(range) {
          case 'range0To8': return grade >= 0 && grade < 8;
          case 'range9To9': return grade >= 9 && grade < 10;
          case 'range10To11': return grade >= 10 && grade < 12;
          case 'range12To13': return grade >= 12 && grade < 14;
          case 'range14To15': return grade >= 14 && grade < 16;
          case 'range16To17': return grade >= 16 && grade < 18;
          case 'range18To20': return grade >= 18 && grade <= 20;
          default: return false;
        }
      }).length;

      const totalA = studentsWithGradesA.length;
      const totalB = studentsWithGradesB.length;

      const percentageA = totalA > 0 ? ((termACount / totalA) * 100).toFixed(2) : '0.00';
      const percentageB = totalB > 0 ? ((termBCount / totalB) * 100).toFixed(2) : '0.00';
      const difference = Math.abs(parseFloat(percentageA) - parseFloat(percentageB)).toFixed(2);

      let remark = '';
      let remarkType: RemarkType = 'secondary';

      if (termACount > termBCount) {
        remark = `زيادة في ${termA}`;
        remarkType = 'success';
      } else if (termBCount > termACount) {
        remark = `زيادة في ${termB}`;
        remarkType = 'danger';
      } else if (termACount === termBCount && (termACount > 0 || termBCount > 0)) {
        remark = 'لا يوجد فرق';
        remarkType = 'secondary';
      } else {
        remark = 'لا توجد بيانات';
        remarkType = 'secondary';
      }

      return {
        subject: baseSubject,
        termACount,
        termAPercentage: percentageA,
        termBCount,
        termBPercentage: percentageB,
        difference,
        remark,
        remarkType,
        hasData: true
      };
    }).filter(stat => stat !== null); // Remove null entries (subjects without data)
  };

  // Memoize calculations for each range
  const range0To8Distribution = useMemo(() => calculateRangeDistribution('range0To8'), [data, termA, termB]);
  const range9To9Distribution = useMemo(() => calculateRangeDistribution('range9To9'), [data, termA, termB]);
  const range10To11Distribution = useMemo(() => calculateRangeDistribution('range10To11'), [data, termA, termB]);
  const range12To13Distribution = useMemo(() => calculateRangeDistribution('range12To13'), [data, termA, termB]);
  const range14To15Distribution = useMemo(() => calculateRangeDistribution('range14To15'), [data, termA, termB]);
  const range16To17Distribution = useMemo(() => calculateRangeDistribution('range16To17'), [data, termA, termB]);
  const range18To20Distribution = useMemo(() => calculateRangeDistribution('range18To20'), [data, termA, termB]);

  // Get current distribution based on active tab
  const currentDistribution = useMemo(() => {
    switch(activeTab) {
      case 'range0To8': return range0To8Distribution;
      case 'range9To9': return range9To9Distribution;
      case 'range10To11': return range10To11Distribution;
      case 'range12To13': return range12To13Distribution;
      case 'range14To15': return range14To15Distribution;
      case 'range16To17': return range16To17Distribution;
      case 'range18To20': return range18To20Distribution;
      default: return range0To8Distribution;
    }
  }, [activeTab, range0To8Distribution, range9To9Distribution, range10To11Distribution, 
      range12To13Distribution, range14To15Distribution, range16To17Distribution, range18To20Distribution]);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>

      <div className="flex justify-between items-center mb-4">
        <h2 id='detailedGradeDistributionDiffTitle' className="table-title text-xl font-semibold">
          مقارنة التوزيع التفصيلي بين {termA} و {termB} | 
          {activeTab === 'range0To8'
            ? ' الدرجات أقل من 8'
            : activeTab === 'range9To9'
            ? ' الدرجات من 9 إلى 9.99'
            : activeTab === 'range10To11'
            ? ' الدرجات من 10 إلى 11.99'
            : activeTab === 'range12To13'
            ? ' الدرجات من 12 إلى 13.99'
            : activeTab === 'range14To15'
            ? ' الدرجات من 14 إلى 15.99'
            : activeTab === 'range16To17'
            ? ' الدرجات من 16 إلى 17.99'
            : ' الدرجات أكبر من 18'}
        </h2>
        <div className="flex gap-2">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-gray-300 cursor-not-allowed opacity-50"
            disabled
            title="التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(true)}
            className="p-2 text-gray-300 cursor-not-allowed opacity-50"
            disabled
            title="عرض الرسم البياني"
          >
            <BarChart2 className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={handlePrint}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel('detailedGradeDistributionDiffTable')}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="w-full max-w mx-auto">
        <nav className="flex w-full border-b border-gray-200">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('range0To8')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'range0To8'
                ? 'border-red-500 text-red-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            أقل من 8
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('range9To9')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'range9To9'
                ? 'border-yellow-500 text-yellow-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            من 9 إلى 9.99
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('range10To11')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'range10To11'
                ? 'border-blue-500 text-blue-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            من 10 إلى 11.99
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('range12To13')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'range12To13'
                ? 'border-indigo-500 text-indigo-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            من 12 إلى 13.99
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('range14To15')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'range14To15'
                ? 'border-green-500 text-green-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            من 14 إلى 15.99
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('range16To17')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'range16To17'
                ? 'border-teal-500 text-teal-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            من 16 إلى 17.99
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('range18To20')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'range18To20'
                ? 'border-purple-500 text-purple-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            أكبر من 18
          </motion.button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        <div className="overflow-x-auto">
          <table id="detailedGradeDistributionDiffTable" className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <tr>
                <th className="px-6 py-6 text-center text-sm font-bold" rowSpan={2}>المادة</th>
                <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" colSpan={2}>{termA}</th>
                <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" colSpan={2}>{termB}</th>
                <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" rowSpan={2}>الفرق</th>
                <th className="px-6 py-6 text-center text-sm font-bold" rowSpan={2}>ملاحظة</th>
              </tr>
              <tr>
                <th className="px-6 py-6 text-center text-sm font-bold">العدد</th>
                <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100">النسبة</th>
                <th className="px-6 py-6 text-center text-sm font-bold">العدد</th>
                <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100">النسبة</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
              {currentDistribution.map((dist, index) => (
                <tr key={index}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.subject}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.termACount}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.termAPercentage}%</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.termBCount}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.termBPercentage}%</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.difference}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={`px-2 inline-flex text-sm leading-8 font-semibold rounded-md ${getRemarkTypeClass(dist.remarkType)}`}>
                      {dist.remark}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analysis and Chart components would go here */}
    </div>
  );
};
//---------------------------------------------------------------------------
// ✅ Harmony Stats Table Diffrence
interface HarmonyStatsTableDiffrenceProps {
  data: Student[];
  termA: string;
  termB: string;
  isDarkMode: boolean;
}
const HarmonyStatsTable: React.FC<HarmonyStatsTableDiffrenceProps> = ({ data, termA, termB, isDarkMode }) => {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  // Helper to extract value from subject item
  const getSubjectValue = (subject: string | { value: string }) =>
    typeof subject === 'string' ? subject : subject.value;

  // Collect all possible base subjects from both terms
  const getAllBaseSubjects = (): string[] => {
    const allSubjects = new Set<string>();
    subjectsByTerm[termA]?.forEach(s => allSubjects.add(getBaseSubject(getSubjectValue(s), termA)));
    subjectsByTerm[termB]?.forEach(s => allSubjects.add(getBaseSubject(getSubjectValue(s), termB)));
    return Array.from(allSubjects);
  };

  const baseSubjects = getAllBaseSubjects();

  const stats = useMemo(() => {
    return baseSubjects.map(baseSubject => {
      const fieldA = getSubjectField(baseSubject, termA);
      const fieldB = getSubjectField(baseSubject, termB);

      // Calculate harmony ratio for term A
      const gradesA = data.filter(student => typeof student[fieldA] === 'number' && student[fieldA] >= 0.01).map(student => student[fieldA]);
      const meanA = calculateMean(gradesA);
      const stdDevA = calculateStdDev(gradesA, meanA);
      const harmonyRatioA = stdDevA !== 0 ? (stdDevA / meanA) * 100 : 0;

      // Calculate harmony ratio for term B
      const gradesB = data.filter(student => typeof student[fieldB] === 'number' && student[fieldB] >= 0.01).map(student => student[fieldB]);
      const meanB = calculateMean(gradesB);
      const stdDevB = calculateStdDev(gradesB, meanB);
      const harmonyRatioB = stdDevB !== 0 ? (stdDevB / meanB) * 100 : 0;

      // Calculate difference
      const difference = Math.abs(harmonyRatioA - harmonyRatioB).toFixed(2);

      // Determine remarks
      let remark = '';
      let remarkType: RemarkType = 'secondary';

      if (gradesA.length === 0 && gradesB.length === 0) {
        remark = 'لا توجد بيانات';
        remarkType = 'secondary';
      } else if (harmonyRatioA < harmonyRatioB) {
        remark = 'انسجام أفضل في ' + termA;
        remarkType = 'success';
      } else if (harmonyRatioB < harmonyRatioA) {
        remark = 'انسجام أفضل في ' + termB;
        remarkType = 'info';
      } else if (harmonyRatioA === harmonyRatioB && (gradesA.length > 0 || gradesB.length > 0)) {
        remark = 'نفس مستوى الانسجام';
        remarkType = 'secondary';
      }

      return {
        subject: baseSubject,
        fieldA,
        fieldB,
        harmonyRatioA: Number(harmonyRatioA.toFixed(2)),
        harmonyRatioB: Number(harmonyRatioB.toFixed(2)),
        difference: Number(difference),
        remark,
        remarkType,
        hasData: gradesA.length > 0 || gradesB.length > 0
      };
    }).filter(stat => stat.hasData);
  }, [data, termA, termB, baseSubjects]);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id='harmonyStatsDiffTitle' className="table-title text-xl font-semibold">
          مقارنة نسب الإنسجام بين {termA} و {termB}
        </h2>
        <div className="flex gap-2">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-gray-300 cursor-not-allowed opacity-50"
            disabled
            title="التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(true)}
            className="p-2 text-gray-300 cursor-not-allowed opacity-50"
            disabled
            title="عرض الرسم البياني"
          >
            <BarChart2 className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => printTable('harmonyStatsDiffTable', 'harmonyStatsDiffTitle')}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel('harmonyStatsDiffTable')}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table id="harmonyStatsDiffTable" className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <tr>
              <th className="px-6 py-6 text-center text-sm font-bold" rowSpan={2}>المادة</th>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100">{termA}</th>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100">{termB}</th>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" rowSpan={2}>الفرق</th>
              <th className="px-6 py-6 text-center text-sm font-bold" rowSpan={2}>ملاحظة</th>
            </tr>
            <tr>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100">نسبة الإنسجام</th>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100">نسبة الإنسجام</th>
            </tr>
          </thead>
          
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
            {stats.map((row) => (
              <tr key={row.subject}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{row.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100">{row.harmonyRatioA.toFixed(2)}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100">{row.harmonyRatioB.toFixed(2)}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100">{row.difference.toFixed(2)}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <span className={`px-2 inline-flex text-sm leading-8 font-semibold rounded-md ${getRemarkTypeClass(row.remarkType)}`}>
                    {row.remark}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
//---------------------------------------------------------------------------
//تحليل النتائج السنوية حسب الفئات الخمس
interface CategoryStatsTableDiffrenceProps {
  data: Student[];
  termA: string;
  termB: string;
  isDarkMode: boolean;
}
const CategoryStatsTable: React.FC<CategoryStatsTableDiffrenceProps> = ({ data, termA, termB, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<
    'weakCategory' | 'nearAverageCategory' | 'averageCategory' | 
    'goodCategory' | 'excellentCategory'
  >('weakCategory');
  
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  const handlePrint = () => {
    if (activeTab === 'weakCategory') {
      printTable('categoryStatsDiffTable', 'categoryStatsDiffTitle');
    } else if (activeTab === 'nearAverageCategory') {
      printTable('categoryStatsDiffTable', 'categoryStatsDiffTitle');
    } else if (activeTab === 'averageCategory') {
      printTable('categoryStatsDiffTable', 'categoryStatsDiffTitle');
    } else if (activeTab === 'goodCategory') {
      printTable('categoryStatsDiffTable', 'categoryStatsDiffTitle');
    } else if (activeTab === 'excellentCategory') {
      printTable('categoryStatsDiffTable', 'categoryStatsDiffTitle');
    }
  };

  // Helper to get the appropriate field name for each term
  const getSubjectField = (baseSubject: string, term: string): string => {
    if (term === 'الفصل الأول') return S1SubjectMap[baseSubject] || baseSubject;
    if (term === 'الفصل الثاني') return S2SubjectMap[baseSubject] || baseSubject;
    if (term === 'الفصل الثالث') return S3SubjectMap[baseSubject] || baseSubject;
    if (term === 'المعدلات السنوية') return AnnualSubjectMap[baseSubject] || baseSubject;
    return certificateSubjectMap[baseSubject] || baseSubject;
  };

  // Helper to extract value from subject item
  const getSubjectValue = (subject: string | { value: string }) =>
    typeof subject === 'string' ? subject : subject.value;

  // Collect all possible base subjects from both terms
  const getAllBaseSubjects = (): string[] => {
    const allSubjects = new Set<string>();
    subjectsByTerm[termA]?.forEach(s => allSubjects.add(getBaseSubject(getSubjectValue(s), termA)));
    subjectsByTerm[termB]?.forEach(s => allSubjects.add(getBaseSubject(getSubjectValue(s), termB)));
    return Array.from(allSubjects);
  };

  // Calculate category boundaries based on mean and standard deviation
  const calculateCategoryBoundaries = (grades: number[]) => {
    const mean = calculateMean(grades);
    const stdDev = calculateStdDev(grades, mean);
    
    return {
      x1: Math.abs((stdDev * 3 / 2) - mean),
      x2: Math.abs((stdDev * 1 / 2) - mean),
      x3: Math.abs((stdDev * 1 / 2) + mean),
      x4: Math.abs((stdDev * 2 / 2) + mean)
    };
  };

  // Calculate distribution for a specific category
  const calculateCategoryDistribution = (
    category: 'weakCategory' | 'nearAverageCategory' | 'averageCategory' | 
              'goodCategory' | 'excellentCategory'
  ) => {
    const baseSubjects = getAllBaseSubjects();
    
    return baseSubjects.map(baseSubject => {
      const fieldA = getSubjectField(baseSubject, termA);
      const fieldB = getSubjectField(baseSubject, termB);

      // Get grades for each term
      const gradesA = data
        .filter(student => typeof student[fieldA] === 'number' && student[fieldA] >= 0.01)
        .map(student => student[fieldA]);
      const gradesB = data
        .filter(student => typeof student[fieldB] === 'number' && student[fieldB] >= 0.01)
        .map(student => student[fieldB]);

      // Check if subject has data in either term
      const hasData = gradesA.length > 0 || gradesB.length > 0;
      if (!hasData) return null;

      // Calculate category boundaries for each term
      const boundariesA = gradesA.length > 0 ? calculateCategoryBoundaries(gradesA) : null;
      const boundariesB = gradesB.length > 0 ? calculateCategoryBoundaries(gradesB) : null;

      // Calculate counts for current category in each term
      const calculateCategoryCount = (grades: number[], boundaries: any) => {
        if (!boundaries) return 0;
        
        switch(category) {
          case 'weakCategory': 
            return grades.filter(grade => grade > 0 && grade <= boundaries.x1).length;
          case 'nearAverageCategory': 
            return grades.filter(grade => grade > boundaries.x1 && grade <= boundaries.x2).length;
          case 'averageCategory': 
            return grades.filter(grade => grade > boundaries.x2 && grade <= boundaries.x3).length;
          case 'goodCategory': 
            return grades.filter(grade => grade > boundaries.x3 && grade <= boundaries.x4).length;
          case 'excellentCategory': 
            return grades.filter(grade => grade > boundaries.x4 && grade <= 20).length;
          default: return 0;
        }
      };

      const termACount = boundariesA ? calculateCategoryCount(gradesA, boundariesA) : 0;
      const termBCount = boundariesB ? calculateCategoryCount(gradesB, boundariesB) : 0;

      const totalA = gradesA.length;
      const totalB = gradesB.length;

      const percentageA = totalA > 0 ? ((termACount / totalA) * 100).toFixed(2) : '0.00';
      const percentageB = totalB > 0 ? ((termBCount / totalB) * 100).toFixed(2) : '0.00';
      const difference = Math.abs(parseFloat(percentageA) - parseFloat(percentageB)).toFixed(2);

      let remark = '';
      let remarkType: RemarkType = 'secondary';

      if (termACount > termBCount) {
        remark = `زيادة في ${termA}`;
        remarkType = category === 'weakCategory' ? 'danger' : 'success';
      } else if (termBCount > termACount) {
        remark = `زيادة في ${termB}`;
        remarkType = category === 'weakCategory' ? 'danger' : 'success';
      } else if (termACount === termBCount && (termACount > 0 || termBCount > 0)) {
        remark = 'لا يوجد فرق';
        remarkType = 'secondary';
      } else {
        remark = 'لا توجد بيانات';
        remarkType = 'secondary';
      }

      return {
        subject: baseSubject,
        termACount,
        termAPercentage: percentageA,
        termBCount,
        termBPercentage: percentageB,
        difference,
        remark,
        remarkType,
        hasData: true
      };
    }).filter(stat => stat !== null); // Remove null entries (subjects without data)
  };

  // Memoize calculations for each category
  const weakCategoryDistribution = useMemo(() => calculateCategoryDistribution('weakCategory'), [data, termA, termB]);
  const nearAverageCategoryDistribution = useMemo(() => calculateCategoryDistribution('nearAverageCategory'), [data, termA, termB]);
  const averageCategoryDistribution = useMemo(() => calculateCategoryDistribution('averageCategory'), [data, termA, termB]);
  const goodCategoryDistribution = useMemo(() => calculateCategoryDistribution('goodCategory'), [data, termA, termB]);
  const excellentCategoryDistribution = useMemo(() => calculateCategoryDistribution('excellentCategory'), [data, termA, termB]);

  // Get current distribution based on active tab
  const currentDistribution = useMemo(() => {
    switch(activeTab) {
      case 'weakCategory': return weakCategoryDistribution;
      case 'nearAverageCategory': return nearAverageCategoryDistribution;
      case 'averageCategory': return averageCategoryDistribution;
      case 'goodCategory': return goodCategoryDistribution;
      case 'excellentCategory': return excellentCategoryDistribution;
      default: return weakCategoryDistribution;
    }
  }, [activeTab, weakCategoryDistribution, nearAverageCategoryDistribution, 
      averageCategoryDistribution, goodCategoryDistribution, excellentCategoryDistribution]);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id='categoryStatsDiffTitle' className="table-title text-xl font-semibold">
          مقارنة توزيع الفئات بين  {termA} و {termB} | 
          {activeTab === 'weakCategory'
            ? ' الفئة الضعيفة'
            : activeTab === 'nearAverageCategory'
            ? ' الفئة القريبة من المتوسط'
            : activeTab === 'averageCategory'
            ? ' الفئة المتوسطة'
            : activeTab === 'goodCategory'
            ? ' الفئة الحسنة'
            : ' الفئة الجيدة'}
        </h2>
        <div className="flex gap-2">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-gray-300 cursor-not-allowed opacity-50"
            disabled
            title="التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(true)}
            className="p-2 text-gray-300 cursor-not-allowed opacity-50"
            disabled
            title="عرض الرسم البياني"
          >
            <BarChart2 className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={handlePrint}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel('detailedGradeDistributionDiffTable')}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="w-full max-w-3xl mx-auto">
        <nav className="flex w-full border-b border-gray-200">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('weakCategory')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'weakCategory'
                ? 'border-red-500 text-red-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            الفئة الضعيفة
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('nearAverageCategory')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'nearAverageCategory'
                ? 'border-yellow-500 text-yellow-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            الفئة القريبة من المتوسط
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('averageCategory')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'averageCategory'
                ? 'border-blue-500 text-blue-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            الفئة المتوسطة
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('goodCategory')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'goodCategory'
                ? 'border-green-500 text-green-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            الفئة الحسنة
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('excellentCategory')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'excellentCategory'
                ? 'border-purple-500 text-purple-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            الفئة الجيدة
          </motion.button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        <div className="overflow-x-auto">
          <table id="categoryStatsDiffTable" className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <tr>
                <th className="px-6 py-6 text-center text-sm font-bold" rowSpan={2}>المادة</th>
                <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" colSpan={2}>{termA}</th>
                <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" colSpan={2}>{termB}</th>
                <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" rowSpan={2}>الفرق</th>
                <th className="px-6 py-6 text-center text-sm font-bold" rowSpan={2}>ملاحظة</th>
              </tr>
              <tr>
                <th className="px-6 py-6 text-center text-sm font-bold">العدد</th>
                <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100">النسبة</th>
                <th className="px-6 py-6 text-center text-sm font-bold">العدد</th>
                <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100">النسبة</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
              {currentDistribution.map((dist, index) => (
                <tr key={index}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.subject}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.termACount}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.termAPercentage}%</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.termBCount}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.termBPercentage}%</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.difference}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={`px-2 inline-flex text-sm leading-8 font-semibold rounded-md ${getRemarkTypeClass(dist.remarkType)}`}>
                      {dist.remark}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analysis and Chart components would go here */}
    </div>
  );
};
//---------------------------------------------------------------------------
// ✅ Merit Table Diffrence
interface MeritTableDiffrenceProps {
  data: Student[];
  termA: string;
  termB: string;
  isDarkMode: boolean;
}
const MeritTable: React.FC<MeritTableDiffrenceProps> = ({ data, termA, termB, isDarkMode }) => {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  // Get the appropriate field name for each term's average
  const getTermAverageField = (term: string): string => {
    if (term === 'الفصل الأول') return 'معدل الفصل 1';
    if (term === 'الفصل الثاني') return 'معدل الفصل 2';
    if (term === 'الفصل الثالث') return 'معدل الفصل 3';
    if (term === 'المعدلات السنوية') return 'المعدل السنوي';
    return 'معدل ش ت م'; // Default to certificate average
  };

  const stats = useMemo(() => {
    const fieldA = getTermAverageField(termA);
    const fieldB = getTermAverageField(termB);

    const meritCategories = [
      { indicator: 'إمتياز', min: 18, max: 20 },
      { indicator: 'تهنئة', min: 15, max: 17.99 },
      { indicator: 'تشجيع', min: 14, max: 14.99 },
      { indicator: 'لوحة شرف', min: 12, max: 13.99 },
      { indicator: 'ملاحظة', min: 0, max: 11.99 }
    ];

    // Calculate stats for both terms
    const termAStats = meritCategories.map(cat => ({
      indicator: cat.indicator,
      count: data.filter(student => 
        typeof student[fieldA] === 'number' && 
        student[fieldA] >= cat.min && 
        student[fieldA] <= cat.max
      ).length
    }));

    const termBStats = meritCategories.map(cat => ({
      indicator: cat.indicator,
      count: data.filter(student => 
        typeof student[fieldB] === 'number' && 
        student[fieldB] >= cat.min && 
        student[fieldB] <= cat.max
      ).length
    }));

    // Calculate totals
    const totalA = termAStats.reduce((sum, stat) => sum + stat.count, 0);
    const totalB = termBStats.reduce((sum, stat) => sum + stat.count, 0);

    // Combine results with percentages and differences
    const combinedStats = meritCategories.map((cat, index) => {
      const countA = termAStats[index].count;
      const countB = termBStats[index].count;
      const percentageA = totalA > 0 ? ((countA / totalA) * 100).toFixed(2) : '0.00';
      const percentageB = totalB > 0 ? ((countB / totalB) * 100).toFixed(2) : '0.00';
      const difference = totalA > 0 && totalB > 0 ? 
        Math.abs(parseFloat(percentageA) - parseFloat(percentageB)).toFixed(2) : '0.00';

      let remark = '';
      let remarkType: RemarkType = 'secondary';

      if (countA > countB) {
        remark = `زيادة في ${termA}`;
        remarkType = 'success';
      } else if (countB > countA) {
        remark = `زيادة في ${termB}`;
        remarkType = 'info';
      } else if (countA === countB && (countA > 0 || countB > 0)) {
        remark = 'لا يوجد فرق';
        remarkType = 'secondary';
      } else {
        remark = 'لا توجد بيانات';
        remarkType = 'secondary';
      }

      return {
        indicator: cat.indicator,
        countA,
        percentageA,
        countB,
        percentageB,
        difference,
        remark,
        remarkType
      };
    });

    // Add totals row
    combinedStats.push({
      indicator: 'المجموع',
      countA: totalA,
      percentageA: '100.0',
      countB: totalB,
      percentageB: '100.0',
      difference: '0.0',
      remark: '',
      remarkType: 'secondary'
    });

    return combinedStats;
  }, [data, termA, termB]);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id='MeritDiffTitle' className="text-xl font-semibold">
          مقارنة التوزيع النوعي بين {termA} و {termB}
        </h2>
        <div className="flex gap-2">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-gray-300 cursor-not-allowed opacity-50"
            title="عرض التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(true)}
            className="p-2 text-gray-300 cursor-not-allowed opacity-50"
            title="عرض الرسم البياني"
          >
            <BarChart className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => printTable('MeritDiffTable', 'MeritDiffTitle')}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel('MeritDiffTable')}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table id="MeritDiffTable" className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <tr>
              <th className="px-6 py-6 text-center text-sm font-bold" rowSpan={2}>المؤشرات</th>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" colSpan={2}>{termA}</th>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" colSpan={2}>{termB}</th>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100" rowSpan={2}>الفرق</th>
              <th className="px-6 py-6 text-center text-sm font-bold" rowSpan={2}>ملاحظة</th>
            </tr>
            <tr>
              <th className="px-6 py-6 text-center text-sm font-bold">العدد</th>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100">النسبة</th>
              <th className="px-6 py-6 text-center text-sm font-bold">العدد</th>
              <th className="px-6 py-6 text-center text-sm font-bold border-l-2 border-gray-100">النسبة</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
            {stats.map((stat, index) => (
              <tr key={index}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {stat.indicator}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {stat.countA}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {stat.percentageA}%
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {stat.countB}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {stat.percentageB}%
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center border-l-2 border-gray-100 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {stat.indicator !== 'المجموع' ? `${stat.difference}%` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {stat.remark && (
                    <span className={`px-2 inline-flex text-sm leading-8 font-semibold rounded-md ${getRemarkTypeClass(stat.remarkType)}`}>
                      {stat.remark}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
//---------------------------------------------------------------------------
//#endregion

interface ProgressiveDirectiveAnalysisProps {
  data: Student[];
  isDarkMode: boolean;
}

export function FinalGuidanceAnalysisPage({ data, isDarkMode }: ProgressiveDirectiveAnalysisProps) {
  // Add state for filter modal
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  // Enrich students with computed fields before filtering
  const enrichedData = useMemo(() => enrichStudentsWithDecisionAndProfile(data), [data]);
  const filters = useFilterStore();
  const filteredData = useMemo(() => filterStudents(enrichedData, filters), [enrichedData, filters]);

  // Use our custom hooks to get the statistics
  const genderStats = useGenderStats(filteredData, filters.subjectTermA);
  const repeatStats = useRepeatStats(filteredData, filters.subjectTermA);

  return (
    <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex justify-between items-center mt-8 py-8">
        <h2 className="text-2xl font-bold mb-2">مقارنة النتائج</h2>
          <div className="flex">
            <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
              onClick={() => setFilterModalOpen(true)}
              className="flex justify-between items-center p-2 px-4 m-4 text-gray bg-gray-200 rounded-md hover:text-blue-800 hover:bg-gray-200"
              title="تصفية البيانات"
            >
              تصفية البيانات
              <Filter className="w-5 h-5 mr-4" />
            </motion.button>
            <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
              onClick={() => printAllTablesByClass('printable-table', 'table-title', filteredData)}
              className="flex justify-between items-center p-2 px-4 m-4 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed opacity-50"
              title="طباعة التقرير الكامل"
            >
              طباعة التقرير
              <Printer className="w-5 h-5 mr-4" />
            </motion.button>
          </div>
      </div>

      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        students={data}
        isDarkMode={isDarkMode}
      />

      {/* Table 1: Subject Statistics */}
      <div className="mb-8 mt-8">
        <SubjectStatsTable data={filteredData} termA={filters.subjectTermA} termB={filters.subjectTermB} isDarkMode={isDarkMode} />
      </div>

      {/* Table 2: Grade Distribution */}
      <div className="mb-8">
        <GradeDistributionTable data={filteredData} termA={filters.subjectTermA} termB={filters.subjectTermB} isDarkMode={isDarkMode}  />
      </div>

      {/* New Table: Subject Pass Statistics */}
      <div className="mb-8">
        <SubjectPassTable data={filteredData} termA={filters.subjectTermA} termB={filters.subjectTermB} isDarkMode={isDarkMode} />
      </div>

      {/* Table 3: Gender-based Statistics */}
      <div className="mb-8">
        <GenderStatsTable stats={genderStats} isDarkMode={isDarkMode} data={filteredData} />
      </div>

      {/* Table 4: Repeat-based Statistics */}
      <div className="mb-8">
        <RepeatStatsTable stats={repeatStats} isDarkMode={isDarkMode} data={filteredData} />
      </div>

      {/* Table 6: Detailed Grade Distribution */}
      <div className="mb-8">
        <DetailedGradeDistributionTable data={filteredData} termA={filters.subjectTermA} termB={filters.subjectTermB} isDarkMode={isDarkMode} />
      </div>

      {/* Table 7: Harmony Statistics */}
      <div className="mb-8">
        <HarmonyStatsTable data={filteredData} termA={filters.subjectTermA} termB={filters.subjectTermB} isDarkMode={isDarkMode} />
      </div>

      {/* Table 8: Category Statistics */}
      <div className="mb-8">
        <CategoryStatsTable data={filteredData} termA={filters.subjectTermA} termB={filters.subjectTermB} isDarkMode={isDarkMode} />
      </div>

      {/* New Table: Merit Statistics */}
      <div className="mb-8">
        <MeritTable data={filteredData} termA={filters.subjectTermA} termB={filters.subjectTermB} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
} 

export type { Student };