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

import { useFilterStore } from '../../lib/AnnualfilterStore';
import { filterStudents } from '../../utils/AnnualfilterStudents';
import { FilterModal } from './filter/AnnualFilterModal';

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
import StatisticalCountQualitativePrintableAnalysis from './printanalysis/StatisticalCount';

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
import StatisticalCountChart from './charts/StatisticalCountChart';

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
import StatisticalCountQualitativeAnalysis from './QualitativeAnalysis/StatisticalCountQualitativeAnalysis';

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
  'اللغة العربية م س': number;
  'اللغة الأمازيغية م س': number;
  'اللغة الفرنسية م س': number;
  'اللغة الإنجليزية م س': number;
  'التربية الإسلامية م س': number;
  'التربية المدنية م س': number;
  'التاريخ والجغرافيا م س': number;
  'الرياضيات م س': number;
  'ع الطبيعة و الحياة م س': number;
  'ع الفيزيائية والتكنولوجيا م س': number;
  'المعلوماتية م س': number;
  'التربية التشكيلية م س': number;
  'التربية الموسيقية م س': number;
  'ت البدنية و الرياضية م س': number;
  'المعدل السنوي': number;
  'معدل ش ت م': number;
  'معدل الإنتقال': number;
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
    'ت البدنية و الرياضية'
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

interface GradeDistribution {
  subject: string;
  above10: { count: number; percentage: number };
  between8And10: { count: number; percentage: number };
  below8: { count: number; percentage: number };
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

interface GradeRange {
  count: number;
  percentage: number;
}

interface DetailedGradeDistribution {
  subject: string;
  range0To8: GradeRange;
  range9To9: GradeRange;
  range10To11: GradeRange;
  range12To13: GradeRange;
  range14To15: GradeRange;
  range16To17: GradeRange;
  range18To20: GradeRange;
}

interface HarmonyStats {
  subject: string;
  harmonyRatio: number;
  remark: string;
  remarkType: RemarkType;
}

interface CategoryStats {
  subject: string;
  weakCategory: GradeRange;
  nearAverageCategory: GradeRange;
  averageCategory: GradeRange;
  goodCategory: GradeRange;
  excellentCategory: GradeRange;
}

interface DepartmentStats {
  subject: string;
  departments: { [key: string]: number };
  highestDepartment: string;
  lowestDepartment: string;
  highestMean: number;
  lowestMean: number;
}

interface DirectorateSubjectStats {
  subject: string;
  directorates: { [key: string]: number };
  highestDirectorate: string;
  lowestDirectorate: string;
}

interface DirectoratePerformanceStats {
  directorate: string;
  presentCount: number;
  mean: number;
  stdDev: number;
  remark: string;
  remarkType: RemarkType;
}

interface SchoolStats {
  school: string;
  presentCount: number;
  mean: number;
  stdDev: number;
  remark: string;
  remarkType: RemarkType;
}

interface StatisticalCount {
  count: number;
  percentage: number;
  total: number;
}

interface GenderStatisticalCount {
  male: StatisticalCount;
  female: StatisticalCount;
}

interface RepeatStatisticalCount {
  repeat: StatisticalCount;
  nonRepeat: StatisticalCount;
}

interface DepartmentStatisticalCount {
  [key: string]: StatisticalCount;
}

interface SchoolStatisticalCount {
  [key: string]: StatisticalCount;
}

interface DirectorateStatisticalCount {
  [key: string]: StatisticalCount;
}

interface StatisticalCountData {
  [key: string]: StatisticalCount;
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

interface MeritStats {
  indicator: string;
  count: number;
  percentage?: string;
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

const getDistributionRemark = (percentage: number): { remark: string; type: RemarkType } => {
  if (percentage === 0) return { remark: 'لم تدرس', type: 'secondary' };
  if (percentage > 50) return { remark: 'مقبول', type: 'success' };
  if (percentage < 50) return { remark: 'لمعالجة', type: 'danger' };
  if (percentage === 50) return { remark: 'غير واضح', type: 'warning' };
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
    'التربية التشكيلية ف 1', 'التربية الموسيقية ف 1', 'ت البدنية و الرياضية ف 1', 'المعدل السنوي', 'معدل ش ت م', 'معدل الإنتقال'
  ],
  'الفصل الثاني': [
    'اللغة العربية ف 2', 'اللغة الأمازيغية ف 2', 'اللغة الفرنسية ف 2', 'اللغة الإنجليزية ف 2', 'التربية الإسلامية ف 2',
    'التربية المدنية ف 2', 'التاريخ والجغرافيا ف 2', 'الرياضيات ف 2', 'ع الطبيعة و الحياة ف 2', 'ع الفيزيائية والتكنولوجيا ف 2', 'المعلوماتية ف 2',
    'التربية التشكيلية ف 2', 'التربية الموسيقية ف 2', 'ت البدنية و الرياضية ف 2', 'المعدل السنوي', 'معدل ش ت م', 'معدل الإنتقال'
  ],
  'الفصل الثالث': [
    'اللغة العربية ف 3', 'اللغة الأمازيغية ف 3', 'اللغة الفرنسية ف 3', 'اللغة الإنجليزية ف 3', 'التربية الإسلامية ف 3',
    'التربية المدنية ف 3', 'التاريخ والجغرافيا ف 3', 'الرياضيات ف 3', 'ع الطبيعة و الحياة ف 3', 'ع الفيزيائية والتكنولوجيا ف 3', 'المعلوماتية ف 3',
    'التربية التشكيلية ف 3', 'التربية الموسيقية ف 3', 'ت البدنية و الرياضية ف 3', 'المعدل السنوي', 'معدل ش ت م', 'معدل الإنتقال'
  ],
  'المعدلات السنوية': [
    'اللغة العربية م س', 'اللغة الأمازيغية م س', 'اللغة الفرنسية م س', 'اللغة الإنجليزية م س', 'التربية الإسلامية م س',
    'التربية المدنية م س', 'التاريخ والجغرافيا م س', 'الرياضيات م س', 'ع الطبيعة و الحياة م س', 'ع الفيزيائية والتكنولوجيا م س', 'المعلوماتية م س',
    'التربية التشكيلية م س', 'التربية الموسيقية م س', 'ت البدنية و الرياضية م س', 'المعدل السنوي', 'معدل ش ت م', 'معدل الإنتقال'
  ],
};

// Custom hooks with dynamic subjects
const useSubjectStats = (data: Student[], subjectTerm: string) => {
  return useMemo(() => {
    const subjects = subjectsByTerm[subjectTerm] || subjectsByTerm['المعدلات السنوية'];
    return subjects.map(subject => {
      const grades = data
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
  }, [data, subjectTerm]);
};

const useGradeDistribution = (data: Student[], subjectTerm: string) => {
  return useMemo(() => {
    const subjects = subjectsByTerm[subjectTerm] || subjectsByTerm['المعدلات السنوية'];
    return subjects.map(subject => {
      const grades = data.map(student => student[subject]);
      const total = grades.length;
      const above10 = grades.filter(grade => grade >= 10);
      const between8And10 = grades.filter(grade => grade >= 8 && grade < 10);
      const below8 = grades.filter(grade => grade < 8 && grade > 0);
      const { remark, type } = getDistributionRemark((above10.length / total) * 100);
      return {
        subject,
        above10: {
          count: above10.length,
          percentage: Number(((above10.length / total) * 100).toFixed(2))
        },
        between8And10: {
          count: between8And10.length,
          percentage: Number(((between8And10.length / total) * 100).toFixed(2))
        },
        below8: {
          count: below8.length,
          percentage: Number(((below8.length / total) * 100).toFixed(2))
        },
        remark,
        remarkType: type
      };
    });
  }, [data, subjectTerm]);
};

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

const calculateDetailedGradeDistribution = (data: Student[]): DetailedGradeDistribution[] => {
  const subjects = [
    'اللغة العربية م س', 'اللغة الأمازيغية م س', 'اللغة الفرنسية م س', 'اللغة الإنجليزية م س', 'التربية الإسلامية م س',
    'التربية المدنية م س', 'التاريخ والجغرافيا م س', 'الرياضيات م س', 'ع الطبيعة و الحياة م س', 'ع الفيزيائية والتكنولوجيا م س', 'المعلوماتية م س',
    'التربية التشكيلية م س', 'التربية الموسيقية م س', 'ت البدنية و الرياضية م س', 'المعدل السنوي', 'معدل ش ت م', 'معدل الإنتقال'
  ];

  return subjects.map(subject => {
    // تصفية العلامات غير الرقمية
    const grades = data
      .map(student => {
        const value = student[subject];
        return typeof value === 'number' && !isNaN(value) ? value : null;
      })
      .filter((v): v is number => v !== null);

    const total = grades.length;

    const calculateRange = (min: number, max: number) => {
      const count = grades.filter(grade => grade >= min && grade <= max).length;
      return {
        count,
        percentage: total > 0 ? Number(((count / total) * 100).toFixed(2)) : 0
      };
    };

    return {
      subject,
      range0To8: calculateRange(0, 8.99),
      range9To9: calculateRange(9, 9.99),
      range10To11: calculateRange(10, 11.99),
      range12To13: calculateRange(12, 13.99),
      range14To15: calculateRange(14, 15.99),
      range16To17: calculateRange(16, 17.99),
      range18To20: calculateRange(18, 20)
    };
  });
};

const calculateHarmonyStats = (data: Student[]): HarmonyStats[] => {
  const subjects = [
    'اللغة العربية م س', 'اللغة الأمازيغية م س', 'اللغة الفرنسية م س', 'اللغة الإنجليزية م س', 'التربية الإسلامية م س',
    'التربية المدنية م س', 'التاريخ والجغرافيا م س', 'الرياضيات م س', 'ع الطبيعة و الحياة م س', 'ع الفيزيائية والتكنولوجيا م س', 'المعلوماتية م س',
    'التربية التشكيلية م س', 'التربية الموسيقية م س', 'ت البدنية و الرياضية م س', 'المعدل السنوي', 'معدل ش ت م', 'معدل الإنتقال'
  ];

  return subjects.map(subject => {
    const grades = data
      .filter(student => typeof student[subject] === "number" && student[subject] >= 0.01)
      .map(student => student[subject]);

    const mean = calculateMean(grades);
    const stdDev = calculateStdDev(grades, mean);
    const harmonyRatio = stdDev === 0 ? 0 : (stdDev / mean) * 100;

    let remark = 'لم تدرس';
    let remarkType: RemarkType = 'secondary';

    if (harmonyRatio > 0) {
      if (harmonyRatio <= 15) {
        remark = 'هناك إنسجام تام';
        remarkType = 'success';
      } else if (harmonyRatio <= 30) {
        remark = 'هناك إنسجام نسبي';
        remarkType = 'warning';
      } else {
        remark = 'هناك تشتت واختلاف';
        remarkType = 'danger';
      }
    }

    return {
      subject,
      harmonyRatio: Number(harmonyRatio.toFixed(2)),
      remark,
      remarkType
    };
  });
};

const calculateCategoryStats = (data: Student[]): CategoryStats[] => {
  const subjects = [
    'اللغة العربية م س', 'اللغة الأمازيغية م س', 'اللغة الفرنسية م س', 'اللغة الإنجليزية م س', 'التربية الإسلامية م س',
    'التربية المدنية م س', 'التاريخ والجغرافيا م س', 'الرياضيات م س', 'ع الطبيعة و الحياة م س', 'ع الفيزيائية والتكنولوجيا م س', 'المعلوماتية م س',
    'التربية التشكيلية م س', 'التربية الموسيقية م س', 'ت البدنية و الرياضية م س', 'المعدل السنوي', 'معدل ش ت م', 'معدل الإنتقال'
  ];

  return subjects.map(subject => {
    const grades = data
      .filter(student => typeof student[subject] === "number" && student[subject] >= 0.01)
      .map(student => student[subject]);

    const mean = calculateMean(grades);
    const stdDev = calculateStdDev(grades, mean);
    const total = grades.length;

    const x1 = Math.abs((stdDev * 3 / 2) - mean);
    const x2 = Math.abs((stdDev * 1 / 2) - mean);
    const x3 = Math.abs((stdDev * 1 / 2) + mean);
    const x4 = Math.abs((stdDev * 2 / 2) + mean);

    const calculateCategory = (min: number, max: number) => {
      const count = grades.filter(grade => grade > min && grade <= max).length;
      const percentage = total > 0 ? Number(((count / total) * 100).toFixed(2)) : 0;
      return {
        count,
        percentage
      };
    };

    return {
      subject,
      weakCategory: calculateCategory(0, x1),
      nearAverageCategory: calculateCategory(x1, x2),
      averageCategory: calculateCategory(x2, x3),
      goodCategory: calculateCategory(x3, x4),
      excellentCategory: calculateCategory(x4, 20)
    };
  });
};

const calculateDepartmentStats = (data: Student[]): DepartmentStats[] => {
  const subjects = [
    'اللغة العربية م س', 'اللغة الأمازيغية م س', 'اللغة الفرنسية م س', 'اللغة الإنجليزية م س', 'التربية الإسلامية م س',
    'التربية المدنية م س', 'التاريخ والجغرافيا م س', 'الرياضيات م س', 'ع الطبيعة و الحياة م س', 'ع الفيزيائية والتكنولوجيا م س', 'المعلوماتية م س',
    'التربية التشكيلية م س', 'التربية الموسيقية م س', 'ت البدنية و الرياضية م س', 'المعدل السنوي', 'معدل ش ت م', 'معدل الإنتقال'
  ];

  const departments = [...new Set(data.map(student => student['القسم']))];

  if (departments.length <= 1) {
    return [];
  }

  return subjects.map(subject => {
    const departmentStats: { [key: string]: number } = {};
    let highestDepartment = '';
    let lowestDepartment = '';
    let highestMean = -Infinity;
    let lowestMean = Infinity;
    let noMean = 0;
    let noDepartment = '';

    departments.forEach(department => {
      const departmentGrades = data
        .filter(student => student['القسم'] === department && student[subject] >= 0.01)
        .map(student => student[subject]);

      const mean = calculateMean(departmentGrades);
      departmentStats[department] = Number(mean.toFixed(2));

      if (mean > highestMean && mean > 0.01) {
        highestMean = mean;
        highestDepartment = department;
      }
      if (mean < lowestMean && mean > 0.01) {
        lowestMean = mean;
        lowestDepartment = department;
      }
      if (mean === noMean) {
        noMean = mean;
        noDepartment = department;
      }
    });

    return {
      subject,
      departments: departmentStats,
      highestDepartment,
      lowestDepartment,
      highestMean,
      lowestMean,
      noMean,
      noDepartment,
    };
  });
};

const calculateDirectorateSubjectStats = (data: Student[]): DirectorateSubjectStats[] => {
  const subjects = [
    'اللغة العربية م س', 'اللغة الأمازيغية م س', 'اللغة الفرنسية م س', 'اللغة الإنجليزية م س', 'التربية الإسلامية م س',
    'التربية المدنية م س', 'التاريخ والجغرافيا م س', 'الرياضيات م س', 'ع الطبيعة و الحياة م س', 'ع الفيزيائية والتكنولوجيا م س', 'المعلوماتية م س',
    'التربية التشكيلية م س', 'التربية الموسيقية م س', 'ت البدنية و الرياضية م س', 'المعدل السنوي', 'معدل ش ت م', 'معدل الإنتقال'
  ];

  const directorates = [...new Set(data.map(student => student['المديرية']))];

  if (directorates.length <= 1) {
    return [];
  }

  return subjects.map(subject => {
    const directorateStats: { [key: string]: number } = {};
    let highestDirectorate = '';
    let lowestDirectorate = '';
    let highestMean = -Infinity;
    let lowestMean = Infinity;

    directorates.forEach(directorate => {
      const directorateGrades = data
        .filter(student => student['المديرية'] === directorate && student[subject] >= 0.01)
        .map(student => student[subject]);

      const mean = calculateMean(directorateGrades);
      directorateStats[directorate] = Number(mean.toFixed(2));

      if (mean > highestMean) {
        highestMean = mean;
        highestDirectorate = directorate;
      }
      if (mean < lowestMean) {
        lowestMean = mean;
        lowestDirectorate = directorate;
      }
    });

    return {
      subject,
      directorates: directorateStats,
      highestDirectorate,
      lowestDirectorate
    };
  });
};

const calculateSchoolStats = (data: Student[]): SchoolStats[] => {
  const schools = [...new Set(data.map(student => student['المؤسسة']))];

  return schools.map(school => {
    const schoolGrades = data
      .filter(student => student['المؤسسة'] === school && student['معدل ش ت م'] >= 0.01)
      .map(student => student['معدل ش ت م']);

    const mean = calculateMean(schoolGrades);
    const stdDev = calculateStdDev(schoolGrades, mean);
    const { remark, type } = getRemark(mean, stdDev);

    return {
      school,
      presentCount: schoolGrades.length,
      mean: Number(mean.toFixed(2)),
      stdDev: Number(stdDev.toFixed(2)),
      remark,
      remarkType: type
    };
  });
};

const calculateDirectoratePerformanceStats = (data: Student[]): DirectoratePerformanceStats[] => {
  const directorates = [...new Set(data.map(student => student['المديرية']))];

  return directorates.map(directorate => {
    const directorateGrades = data
      .filter(student => student['المديرية'] === directorate && student['معدل ش ت م'] >= 0.01)
      .map(student => student['معدل ش ت م']);

    const mean = calculateMean(directorateGrades);
    const stdDev = calculateStdDev(directorateGrades, mean);
    const { remark, type } = getRemark(mean, stdDev);

    return {
      directorate,
      presentCount: directorateGrades.length,
      mean: Number(mean.toFixed(2)),
      stdDev: Number(stdDev.toFixed(2)),
      remark,
      remarkType: type
    };
  });
};

const calculateGenderStatisticalCount = (data: Student[]): GenderStatisticalCount => {
  const total = data.length;
  const maleCount = data.filter(student => student['الجنس'] === 'ذكر').length;
  const femaleCount = data.filter(student => student['الجنس'] === 'أنثى').length;

  return {
    male: {
      count: maleCount,
      percentage: Number(((maleCount / total) * 100).toFixed(2)),
      total
    },
    female: {
      count: femaleCount,
      percentage: Number(((femaleCount / total) * 100).toFixed(2)),
      total
    }

  };
};

const calculateRepeatStatisticalCount = (data: Student[]): RepeatStatisticalCount => {
  const total = data.length;
  const repeatCount = data.filter(student => student['الإعادة'] === 'نعم').length;
  const nonRepeatCount = data.filter(student => student['الإعادة'] === 'لا').length;

  return {
    repeat: {
      count: repeatCount,
      percentage: Number(((repeatCount / total) * 100).toFixed(2)),
      total
    },
    nonRepeat: {
      count: nonRepeatCount,
      percentage: Number(((nonRepeatCount / total) * 100).toFixed(2)),
      total
    }
  };
};

const calculateDepartmentStatisticalCount = (data: Student[]): DepartmentStatisticalCount => {
  const total = data.length;
  const departments = [...new Set(data.map(student => student['القسم']))];
  const result: DepartmentStatisticalCount = {};

  departments.forEach(department => {
    const count = data.filter(student => student['القسم'] === department).length;
    result[department] = {
      count,
      percentage: Number(((count / total) * 100).toFixed(2)),
      total
    };
  });

  return result;
};

const calculateSchoolStatisticalCount = (data: Student[]): SchoolStatisticalCount => {
  const total = data.length;
  const schools = [...new Set(data.map(student => student['المؤسسة']))];
  const result: SchoolStatisticalCount = {};

  schools.forEach(school => {
    const count = data.filter(student => student['المؤسسة'] === school).length;
    result[school] = {
      count,
      percentage: Number(((count / total) * 100).toFixed(2)),
      total
    };
  });

  return result;
};

const calculateDirectorateStatisticalCount = (data: Student[]): DirectorateStatisticalCount => {
  const total = data.length;
  const directorates = [...new Set(data.map(student => student['المديرية']))];
  const result: DirectorateStatisticalCount = {};

  directorates.forEach(directorate => {
    const count = data.filter(student => student['المديرية'] === directorate).length;
    result[directorate] = {
      count,
      percentage: Number(((count / total) * 100).toFixed(2)),
      total
    };
  });

  return result;
};

const calculateGenderDifferences = (data: Student[]): GenderDifferenceStats[] => {
  const subjects = [
    'اللغة العربية م س', 'اللغة الأمازيغية م س', 'اللغة الفرنسية م س', 'اللغة الإنجليزية م س', 'التربية الإسلامية م س',
    'التربية المدنية م س', 'التاريخ والجغرافيا م س', 'الرياضيات م س', 'ع الطبيعة و الحياة م س', 'ع الفيزيائية والتكنولوجيا م س', 'المعلوماتية م س',
    'التربية التشكيلية م س', 'التربية الموسيقية م س', 'ت البدنية و الرياضية م س', 'المعدل السنوي', 'معدل ش ت م', 'معدل الإنتقال'
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
    'التربية التشكيلية م س', 'التربية الموسيقية م س', 'ت البدنية و الرياضية م س', 'المعدل السنوي', 'معدل ش ت م', 'معدل الإنتقال'
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

//#region Table Components
//--------------------------------------------------------------------------
// تحليل نتائج النتائج السنوية
const SubjectStatsTable: React.FC<{ stats: SubjectStats[]; isDarkMode: boolean }> = ({ stats, isDarkMode }): JSX.Element => {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<string | null>(null);

  const handleAnalysisClose = () => {
    setShowAnalysis(null);
  };

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id='subjecttitle' className="text-xl font-semibold">تحليل النتائج الفصلية</h2>
        <div className="flex gap-2">
          <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(stats[0]?.subject || null)}
            className="p-2 text-purple-600 hover:text-purple-800"
            title="التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(true)}
            className="p-2 text-blue-600 hover:text-blue-800"
            title="عرض الرسم البياني"
          >
            <BarChart2 className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => printTable('subjectStatsTable', 'subjecttitle')}
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
      <div className="overflow-x-auto">
        <table id="subjectStatsTable" className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>المادة</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>عدد الحاضرين</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>المتوسط</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>الانحراف المعياري</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>الوسيط</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>المدى</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>التباين</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>ملاحظات</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
            {stats.map((stat) => (
              <tr key={stat.subject}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.subject}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.presentCount}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.mean.toFixed(2)}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.stdDev.toFixed(2)}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.median.toFixed(2)}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.range.toFixed(2)}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.variance.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-sm leading-8 font-semibold rounded-md ${getRemarkTypeClass(stat.remarkType)}`}>
                    {stat.remark}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
      <SubjectStatsPrintableAnalysis stats={stats} />
      {showChart && (
        <SubjectStatsChart
          stats={stats}
          title="تحليل النتائج الفصلية حسب المواد"
          isDarkMode={isDarkMode}
          onClose={() => setShowChart(false)}
        />
      )}
      {showAnalysis && (
        <SubjectStatsQualitativeAnalysis
          field={stats.find(s => s.subject === showAnalysis)?.subject || ''}
          mean={stats.find(s => s.subject === showAnalysis)?.mean || 0}
          stdDev={stats.find(s => s.subject === showAnalysis)?.stdDev || 0}
          remark={stats.find(s => s.subject === showAnalysis)?.remark || ''}
          stats={stats.map(s => ({
            value: s.subject,
            count: s.presentCount,
            percentage: (s.presentCount / stats.reduce((sum, curr) => sum + curr.presentCount, 0)) * 100,
            remark: s.remark
          }))}
          total={stats.reduce((sum, curr) => sum + curr.presentCount, 0)}
          allSubjects={stats.map(s => ({
            field: s.subject,
            mean: s.mean,
            stdDev: s.stdDev
          }))}
          onClose={handleAnalysisClose}
        />
      )}
    </div>
  );
};
//--------------------------------------------------------------------------
// تحليل النتائج السنوية حسب الفئات
const GradeDistributionTable: React.FC<{ distribution: GradeDistribution[]; isDarkMode: boolean }> = ({ distribution, isDarkMode }) => {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  
  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id='gradeDistributiontitle' className="table-title text-xl font-semibold">تحليل النتائج السنوية حسب الفئات</h2>
        <div className="flex gap-2">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-purple-600 hover:text-purple-800"
            title="التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(true)}
            className="p-2 text-blue-600 hover:text-blue-800"
            title="عرض الرسم البياني"
          >
            <BarChart2 className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => printTable('gradeDistributionTable', 'gradeDistributiontitle')}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel('gradeDistributionTable')}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      <table id='gradeDistributionTable' className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
          <tr>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} rowSpan={2}>المواد</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} colSpan={2}>10 ≤</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} colSpan={2}>من 8 إلى 9,99</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} colSpan={2}>أقل من 08</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} rowSpan={2}>الملاحظة</th>
          </tr>
          <tr>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>العدد</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>النسبة</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>العدد</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>النسبة</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>العدد</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>النسبة</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
          {distribution.map((dist) => (
            <tr key={dist.subject}>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.subject}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.above10.count}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.above10.percentage}%</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.between8And10.count}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.between8And10.percentage}%</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.below8.count}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{dist.below8.percentage}%</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-sm leading-8 font-semibold rounded-md 
                  ${dist.remarkType === 'success' ? 'bg-green-100 text-green-800' : ''}
                  ${dist.remarkType === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${dist.remarkType === 'info' ? 'bg-blue-100 text-blue-800' : ''}
                  ${dist.remarkType === 'danger' ? 'bg-red-100 text-red-800' : ''}
                  ${dist.remarkType === 'secondary' ? 'bg-gray-100 text-gray-800' : ''}
                `}>
                  {dist.remark}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <GradeDistributionPrintableAnalysis distribution={distribution} />

      {showChart && (
        <GradeDistributionChart
          distribution={distribution}
          title='تحليل النتائج السنوية حسب الفئات'
          isDarkMode={isDarkMode}
          onClose={() => setShowChart(false)}
        />
      )}
      {showAnalysis && (
        <GradeDistributionQualitativeAnalysis
          distribution={distribution}
          onClose={() => setShowAnalysis(false)}
        />
      )}
    </div>
  );
};
//--------------------------------------------------------------------------
// تحليل النتائج السنوية حسب نسبة النجاح
const SubjectPassTable: React.FC<{ data: Student[]; isDarkMode: boolean }> = ({ data, isDarkMode }) => {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  const subjects = [
    'اللغة العربية م س', 'اللغة الأمازيغية م س', 'اللغة الفرنسية م س', 'اللغة الإنجليزية م س', 'التربية الإسلامية م س',
    'التربية المدنية م س', 'التاريخ والجغرافيا م س', 'الرياضيات م س', 'ع الطبيعة و الحياة م س', 'ع الفيزيائية والتكنولوجيا م س', 'المعلوماتية م س',
    'التربية التشكيلية م س', 'التربية الموسيقية م س', 'ت البدنية و الرياضية م س', 'المعدل السنوي', 'معدل ش ت م', 'معدل الإنتقال'
  ];

  const stats = useMemo(() => {
    const totalStudents = data.length;
    let totalPassCount = 0;

    const subjectStats = subjects.map(subject => {
      const passCount = data.filter(student => student[subject] >= 10).length;
      totalPassCount += passCount;
      const passPercentage = (passCount / totalStudents) * 100;

      let remark = '';
      let remarkType: RemarkType = 'secondary';

      if (passPercentage === 0) {
        remark = 'لم تدرس';
        remarkType = 'secondary';
      } else if (passPercentage >= 50) {
        remark = 'مقبول';
        remarkType = 'success';
      } else {
        remark = 'للمعالجة';
        remarkType = 'danger';
      }

      return {
        subject,
        passCount,
        passPercentage: Number(passPercentage.toFixed(2)),
        remark,
        remarkType
      };
    });

    return {
      subjectStats,
      totalStudents,
      totalPassCount,
      totalPassPercentage: Number(((totalPassCount / (totalStudents * subjects.length)) * 100).toFixed(2))
    };
  }, [data]);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id='subjectPasstitle' className="table-title text-xl font-semibold">نسب النجاح حسب المواد</h2>
        <div className="flex gap-2">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-purple-600 hover:text-purple-800"
            title="التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(true)}
            className="p-2 text-blue-600 hover:text-blue-800"
            title="عرض الرسم البياني"
          >
            <BarChart2 className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => printTable('subjectPassTable', 'subjectPasstitle')}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel('subjectPassTable')}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      <table id='subjectPassTable' className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
          <tr>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>المواد</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>العدد</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>النسبة</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>الملاحظة</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
          {stats.subjectStats.map((stat) => (
            <tr key={stat.subject}>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.subject}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.passCount}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.passPercentage}%</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-sm leading-8 font-semibold rounded-md 
                  ${stat.remarkType === 'success' ? 'bg-green-100 text-green-800' : ''}
                  ${stat.remarkType === 'danger' ? 'bg-red-100 text-red-800' : ''}
                  ${stat.remarkType === 'secondary' ? 'bg-gray-100 text-gray-800' : ''}
                `}>
                  {stat.remark}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
          
      <SubjectPassPrintableAnalysis passRates={stats.subjectStats} />

      {showChart && (
        <SubjectPassChart
          data={stats.subjectStats}
          title="نسب النجاح حسب المواد" 
          isDarkMode={isDarkMode}
          onClose={() => setShowChart(false)}
        />
      )}
      {showAnalysis && (
        <SubjectPassQualitativeAnalysis
          data={stats.subjectStats}
          onClose={() => setShowAnalysis(false)}
        />
      )}
    </div>
  );
};
//--------------------------------------------------------------------------
// تحليل النتائج السنوية حسب الجنس
const GenderStatsTable: React.FC<{ stats: GenderStats; isDarkMode: boolean; data: Student[] }> = ({ stats, isDarkMode, data }) => {
  const [activeTab, setActiveTab] = useState<'male' | 'female' | 'differences'>('male');

  const genderDifferences = useMemo(() => calculateGenderDifferences(data), [data]);

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
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('differences')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'differences'
                ? 'border-purple-500 text-purple-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            الفرق بين الجنسين
          </motion.button>
        </nav>
      </div>
      <div className="mt-4">
        <div className={activeTab === 'male' ? '' : 'hidden'}>
          <SubjectStatsTable stats={stats.male} isDarkMode={isDarkMode} />
        </div>
        <div className={activeTab === 'female' ? '' : 'hidden'}>
          <SubjectStatsTable stats={stats.female} isDarkMode={isDarkMode} />
        </div>
        <div className={activeTab === 'differences' ? '' : 'hidden'}>
          <GenderDifferenceTable differences={genderDifferences} isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};
const GenderDifferenceTable: React.FC<{ differences: GenderDifferenceStats[]; isDarkMode: boolean }> = ({ differences, isDarkMode }) => {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id='genderDifferencetitle' className="table-title text-xl font-semibold">تحليل النتائج السنوية حسب الجنس</h2>
        <div className="flex gap-2">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-purple-600 hover:text-purple-800"
            title="التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(true)}
            className="p-2 text-blue-600 hover:text-blue-800"
            title="عرض الرسم البياني"
          >
            <BarChart2 className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => printTable('genderDifferenceTable', 'genderDifferencetitle')}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel('genderDifferenceTable')}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      <table id='genderDifferenceTable' className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
        <tr>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} rowSpan={2}>المواد</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} colSpan={2}>الذكور</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} colSpan={2} >الإناث</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} rowSpan={2}>الفرق</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} rowSpan={2}>اختبار ت</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} rowSpan={2}>الدلالة</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} rowSpan={2}>الملاحظة</th>
          </tr>
          <tr>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>المعدل</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>الإنحراف المعياري</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>المعدل</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>الإنحراف المعياري</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
          {differences.map((diff) => (
            <tr key={diff.subject}>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{diff.subject}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{diff.maleMean}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{diff.maleStdDev}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{diff.femaleMean}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{diff.femaleStdDev}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{diff.difference}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{diff.tTest}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                {diff.significance === 'significant' ? 'دال' : 'غير دال'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-sm leading-8 font-semibold rounded-md 
                  ${diff.remarkType === 'success' ? 'bg-rose-100 text-rose-800' : ''}
                  ${diff.remarkType === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${diff.remarkType === 'info' ? 'bg-blue-100 text-blue-800' : ''}
                  ${diff.remarkType === 'danger' ? 'bg-red-100 text-red-800' : ''}
                  ${diff.remarkType === 'secondary' ? 'bg-gray-100 text-gray-800' : ''}
                `}>
                  {diff.remark}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <GenderDifferencePrintableAnalysis differences={differences} />

      {showChart && (
        <GenderDifferenceChart
          differences={differences}
          title="توزيع المتوسطات حسب المواد" 
          isDarkMode={isDarkMode}
          onClose={() => setShowChart(false)}
        />
      )}
      {showAnalysis && (
        <GenderDifferenceQualitativeAnalysis
          differences={differences}
          onClose={() => setShowAnalysis(false)}
        />
      )}
    </div>
  );
};
//--------------------------------------------------------------------------
// تحليل النتائج السنوية حسب الإعادة
const RepeatStatsTable: React.FC<{ stats: RepeatStats; isDarkMode: boolean; data: Student[] }> = ({ stats, isDarkMode, data }) => {
  const [activeTab, setActiveTab] = useState<'repeat' | 'nonRepeat' | 'differences'>('repeat');

  const repeatDifferences = useMemo(() => calculateRepeatDifferences(data), [data]);

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
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('differences')}
            className={`flex-1 text-center py-4 border-b-2 text-sm font-semibold ${
              activeTab === 'differences'
                ? 'border-purple-500 text-purple-600'
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
            }`}
          >
            الفرق بين المجموعتين
          </motion.button>
        </nav>
      </div>

      <div className="mt-4">
        <div className={activeTab === 'repeat' ? '' : 'hidden'}>
          <SubjectStatsTable stats={stats.repeat} isDarkMode={isDarkMode} />
        </div>
        <div className={activeTab === 'nonRepeat' ? '' : 'hidden'}>
          <SubjectStatsTable stats={stats.nonRepeat} isDarkMode={isDarkMode} />
        </div>
        <div className={activeTab === 'differences' ? '' : 'hidden'}>
          <RepeatDifferenceTable differences={repeatDifferences} isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};
const RepeatDifferenceTable: React.FC<{ differences: RepeatDifferenceStats[]; isDarkMode: boolean }> = ({ differences, isDarkMode }) => {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id='repeatDifferencetitle' className="table-title text-xl font-semibold">الفرق بين المعيدين وغير المعيدين</h2>
        <div className="flex gap-2">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-purple-600 hover:text-purple-800"
            title="التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(true)}
            className="p-2 text-blue-600 hover:text-blue-800"
            title="عرض الرسم البياني"
          >
            <BarChart2 className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => printTable('repeatDifferenceTable', 'repeatDifferencetitle')}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel('repeatDifferenceTable')}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      <table id='repeatDifferenceTable' className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
          <tr>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} rowSpan={2}>المواد</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} colSpan={2}>المعيدين</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} colSpan={2}>غير المعيدين</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} rowSpan={2}>الفرق</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} rowSpan={2}>اختبار ت</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} rowSpan={2}>الدلالة</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} rowSpan={2}>الملاحظة</th>
          </tr>
          <tr>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>المعدل</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>الإنحراف المعياري</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>المعدل</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>الإنحراف المعياري</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
          {differences.map((diff) => (
            <tr key={diff.subject}>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{diff.subject}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{diff.repeatMean}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{diff.repeatStdDev}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{diff.nonRepeatMean}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{diff.nonRepeatStdDev}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{diff.difference}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{diff.tTest}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                {diff.significance === 'significant' ? 'دال' : 'غير دال'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-sm leading-8 font-semibold rounded-md 
                  ${diff.remarkType === 'success' ? 'bg-rose-100 text-rose-800' : ''}
                  ${diff.remarkType === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${diff.remarkType === 'info' ? 'bg-blue-100 text-blue-800' : ''}
                  ${diff.remarkType === 'danger' ? 'bg-red-100 text-red-800' : ''}
                  ${diff.remarkType === 'secondary' ? 'bg-gray-100 text-gray-800' : ''}
                `}>
                  {diff.remark}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <RepeatDifferencePrintableAnalysis differences={differences} />
      {showChart && (
        <div className="mt-4">
          <RepeatDifferenceChart
            differences={differences}
            title="التوزيع التفصيلي للنتائج"
            isDarkMode={isDarkMode}
            onClose={() => setShowChart(false)}
          />
        </div>
      )}
      {showAnalysis && (
        <RepeatDifferenceQualitativeAnalysis
          differences={differences}
          onClose={() => setShowAnalysis(false)}
        />
      )}
    </div>
  );
};
//---------------------------------------------------------------------------
// تحليل النتائج السنوية حسب حصيلة المعدلات
const DetailedGradeDistributionTable: React.FC<{ distribution: DetailedGradeDistribution[]; isDarkMode: boolean }> = ({ distribution, isDarkMode }) => {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id='detailedGradeDistributiontitle' className="table-title text-xl font-semibold">تحليل النتائج السنوية حسب حصيلة المعدلات</h2>
        <div className="flex gap-2">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-purple-600 hover:text-purple-800"
            title="التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(true)}
            className="p-2 text-blue-600 hover:text-blue-800"
            title="عرض الرسم البياني"
          >
            <BarChart2 className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => printTable('detailedGradeDistributionTable', 'detailedGradeDistributiontitle')}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel('detailedGradeDistributionTable')}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="w-full">
        <table id='detailedGradeDistributionTable' className="printable-table w-full table-fixed border-collapse divide-gray-200">
          <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider w-32`} rowSpan={2}>المواد</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} colSpan={2}>0-8</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} colSpan={2}>9-9.99</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} colSpan={2}>10-11.99</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} colSpan={2}>12-13.99</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} colSpan={2}>14-15.99</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} colSpan={2}>16-17.99</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} colSpan={2}>18-20</th>
            </tr>
            <tr>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>العدد</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>النسبة</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>العدد</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>النسبة</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>العدد</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>النسبة</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>العدد</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>النسبة</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>العدد</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>النسبة</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>العدد</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>النسبة</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>العدد</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>النسبة</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
            {distribution.map((item) => (
              <tr key={item.subject}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.subject}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.range0To8.count}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.range0To8.percentage.toFixed(2)}%</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.range9To9.count}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.range9To9.percentage.toFixed(2)}%</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.range10To11.count}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.range10To11.percentage.toFixed(2)}%</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.range12To13.count}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.range12To13.percentage.toFixed(2)}%</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.range14To15.count}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.range14To15.percentage.toFixed(2)}%</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.range16To17.count}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.range16To17.percentage.toFixed(2)}%</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.range18To20.count}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.range18To20.percentage.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DetailedGradePrintableAnalysis distribution={distribution} />

      {showChart && (
        <div className="mt-4">
          <DetailedGradeDistributionChart
            data={distribution}
            title="التوزيع التفصيلي للنتائج"
            isDarkMode={isDarkMode}
            onClose={() => setShowChart(false)}
          />
        </div>
      )}

      {showAnalysis && (
        <DetailedGradeDistributionQualitativeAnalysis
          distribution={distribution}
          onClose={() => setShowAnalysis(false)}
        />
      )}
    </div>
  );
};
//---------------------------------------------------------------------------
//تحليل النتائج السنوية حسب نسبة الإنسجام
const HarmonyStatsTable: React.FC<{ stats: HarmonyStats[]; isDarkMode: boolean }> = ({ stats, isDarkMode }) => {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id='harmonyStatstitle' className="table-title text-xl font-semibold">تحليل النتائج السنوية حسب نسبة الإنسجام</h2>
        <div className="flex gap-2">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-purple-600 hover:text-purple-800"
            title="التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(true)}
            className="p-2 text-blue-600 hover:text-blue-800"
            title="عرض الرسم البياني"
          >
            <BarChart2 className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => printTable('harmonyStatsTable', 'harmonyStatstitle')}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel('harmonyStatsTable')}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table id='harmonyStatsTable' className="printable-table min-w-full divide-y divide-gray-200">
          <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>المادة</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>نسبة الإنسجام</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>ملاحظة</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
            {stats.map((item) => (
              <tr key={item.subject}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.subject}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {item.harmonyRatio.toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-sm leading-8 font-semibold rounded-md ${getRemarkTypeClass(item.remarkType)}`}>
                    {item.remark}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <HarmonyPrintableAnalysis stats={stats} />

      {showChart && (
        <div className="mt-4">
          <HarmonyStatsChart
            data={stats}
            title="نسب الإنسجام"
            isDarkMode={isDarkMode}
            onClose={() => setShowChart(false)}
          />
        </div>
      )}

      {showAnalysis && (
        <HarmonyStatsQualitativeAnalysis
          stats={stats}
          onClose={() => setShowAnalysis(false)}
        />
      )}
    </div>
  );
};
//---------------------------------------------------------------------------
//تحليل النتائج السنوية حسب الفئات الخمس
const CategoryStatsTable: React.FC<{ stats: CategoryStats[]; isDarkMode: boolean }> = ({ stats, isDarkMode }) => {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id='categoryStatstitle' className="table-title text-xl font-semibold">تحليل النتائج السنوية حسب الفئات الخمس</h2>
        <div className="flex gap-2">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-purple-600 hover:text-purple-800"
            title="التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(true)}
            className="p-2 text-blue-600 hover:text-blue-800"
            title="عرض الرسم البياني"
          >
            <BarChart2 className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => printTable('categoryStatsTable', 'categoryStatstitle')}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel('categoryStatsTable')}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table id='categoryStatsTable' className="printable-table min-w-full divide-y divide-gray-200">
          <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} rowSpan={2}>المادة</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} colSpan={2}>الفئة الضعيفة</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} colSpan={2}>الفئة القريبة من المتوسط</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} colSpan={2}>الفئة المتوسطة</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} colSpan={2}>الفئة الحسنة</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`} colSpan={2}>الفئة الجيدة</th>
            </tr>
            <tr>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>العدد</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>النسبة</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>العدد</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>النسبة</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>العدد</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>النسبة</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>العدد</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>النسبة</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>العدد</th>
              <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>النسبة</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
            {stats.map((item) => (
              <tr key={item.subject}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.subject}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.weakCategory.count}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.weakCategory.percentage.toFixed(2)}%</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.nearAverageCategory.count}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.nearAverageCategory.percentage.toFixed(2)}%</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.averageCategory.count}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.averageCategory.percentage.toFixed(2)}%</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.goodCategory.count}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.goodCategory.percentage.toFixed(2)}%</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.excellentCategory.count}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.excellentCategory.percentage.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CategoryDistributionPrintableAnalysis stats={stats} />

      {showChart && (
        <div className="mt-4">
          <CategoryStatsChart
            data={stats}
            title="توزيع الفئات"
            isDarkMode={isDarkMode}
            onClose={() => setShowChart(false)}
          />
        </div>
      )}

      {showAnalysis && (
        <CategoryStatsQualitativeAnalysis
          stats={stats}
          onClose={() => setShowAnalysis(false)}
        />
      )}
    </div>
  );
};
//---------------------------------------------------------------------------
// تحليل النتائج السنوية حسب الأقسام
const DepartmentStatsTable: React.FC<{ stats: DepartmentStats[]; isDarkMode: boolean }> = ({ stats, isDarkMode }) => {
  if (stats.length === 0) return null;

  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const departments = Object.keys(stats[0].departments);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id='Departmentstatstitle' className="table-title text-xl font-semibold">تحليل النتائج السنوية حسب الأقسام</h2>
        <div className="flex gap-2">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-purple-600 hover:text-purple-800"
            title="التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(true)}
            className="p-2 text-blue-600 hover:text-blue-800"
            title="عرض الرسم البياني"
          >
            <BarChart className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => printTable('Departmentstatstable', 'Departmentstatstitle')}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel('Departmentstatstable')}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      <table id='departmentStatstable' className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
          <tr>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>المواد</th>
            {departments.map(department => (
              <th key={department} className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                {department}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
          {stats.map((stat) => (
            <tr key={stat.subject}>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.subject}</td>
              {departments.map(department => (
                <td key={department} className="px-6 py-4 whitespace-nowrap text-center align-middle">
                  <span className={`px-2 inline-flex text-sm text-center justify-center leading-8 font-semibold rounded-md
                    ${department === stat.highestDepartment ? 'bg-green-100 text-green-800' : ''}
                    ${department === stat.lowestDepartment ? 'bg-red-100 text-red-800' : ''}
                    
                  `}>
                    {stat.departments[department]}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <GeneralDepartmentPerformanceAnalysis stats={stats} />

      {showChart && (
        <DepartmentStatsChart
          stats={stats}
          title="توزيع المتوسطات حسب المواد" 
          isDarkMode={isDarkMode}
          onClose={() => setShowChart(false)}
        />
      )}

      {showAnalysis && (
        <DepartmentStatsQualitativeAnalysis
          stats={stats}
          onClose={() => setShowAnalysis(false)}
        />
      )}
    </div>
  );
};
//---------------------------------------------------------------------------
const DirectorateSubjectStatsTable: React.FC<{ stats: DirectorateSubjectStats[]; isDarkMode: boolean }> = ({ stats, isDarkMode }) => {
  if (stats.length === 0) return null;

  const directorates = Object.keys(stats[0].directorates);

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
          <tr>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>المواد</th>
            {directorates.map(directorate => (
              <th key={directorate} className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                {directorate}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
          {stats.map((stat) => (
            <tr key={stat.subject}>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.subject}</td>
              {directorates.map(directorate => (
                <td key={directorate} className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-sm leading-8 font-semibold rounded-md
                    ${directorate === stat.highestDirectorate ? 'bg-green-100 text-green-800' : ''}
                    ${directorate === stat.lowestDirectorate ? 'bg-red-100 text-red-800' : ''}
                    ${directorate !== stat.highestDirectorate && directorate !== stat.lowestDirectorate ? 'bg-gray-100 text-gray-800' : ''}
                  `}>
                    {stat.directorates[directorate]}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
//---------------------------------------------------------------------------
// تحليل النتائج السنوية حسب المؤسسات
const SchoolStatsTable: React.FC<{ stats: SchoolStats[]; isDarkMode: boolean }> = ({ stats, isDarkMode }) => {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id='Schoolstatstitle' className="table-title text-xl font-semibold">تحليل النتائج السنوية حسب المؤسسات</h2>
        <div className="flex gap-2">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-purple-600 hover:text-purple-800"
            title="عرض التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(true)}
            className="p-2 text-blue-600 hover:text-blue-800"
            title="عرض الرسم البياني"
          >
            <BarChart className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => printTable('Schoolstatstable', 'Schoolstatstitle')}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel('Schoolstatstable')}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      <table id='Schoolstatstable' className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
          <tr>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>المؤسسة</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>الحاضيرون</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>معدل القسم</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>الإنحراف المعياري</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>الملاحظة</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
          {stats.map((stat) => (
            <tr key={stat.school}>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.school}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.presentCount}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.mean}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.stdDev}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-sm leading-8 font-semibold rounded-md
                  ${stat.remarkType === 'success' ? 'bg-green-100 text-green-800' : ''}
                  ${stat.remarkType === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${stat.remarkType === 'info' ? 'bg-blue-100 text-blue-800' : ''}
                  ${stat.remarkType === 'danger' ? 'bg-red-100 text-red-800' : ''}
                  ${stat.remarkType === 'secondary' ? 'bg-gray-100 text-gray-800' : ''}
                `}>
                  {stat.remark}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SchoolPerformancePrintableAnalysis stats={stats} />

      {showAnalysis && (
        <SchoolStatsQualitativeAnalysis
          stats={stats}
          onClose={() => setShowAnalysis(false)}
        />
      )}
      {showChart && (
        <SchoolStatsChart
          stats={stats}
          title="توزيع المتوسطات حسب المؤسسات"
          isDarkMode={isDarkMode}
          onClose={() => setShowChart(false)}
        />
      )}
    </div>
  );
};
//---------------------------------------------------------------------------
// تحليل النتائج السنوية حسب المديريات
const DirectoratePerformanceStatsTable: React.FC<{ stats: DirectoratePerformanceStats[]; isDarkMode: boolean }> = ({ stats, isDarkMode }) => {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  
  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id='DirectoratePerformancestatstitle' className="table-title text-xl font-semibold">تحليل النتائج السنوية حسب المديريات</h2>
        <div className="flex gap-2">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-purple-600 hover:text-purple-800"
            title="عرض التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(true)}
            className="p-2 text-blue-600 hover:text-blue-800"
            title="عرض الرسم البياني"
          >
            <BarChart className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => printTable('DirectoratePerformancestatstable', 'DirectoratePerformancestatstitle')}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel('DirectoratePerformancestatstable')}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      <table id='DirectoratePerformancestatstable' className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
          <tr>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>المديرية</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>الحاضيرون</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>معدل القسم</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>الإنحراف المعياري</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>الملاحظة</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
          {stats.map((stat) => (
            <tr key={stat.directorate}>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.directorate}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.presentCount}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.mean}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.stdDev}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-sm leading-8 font-semibold rounded-md
                  ${stat.remarkType === 'success' ? 'bg-green-100 text-green-800' : ''}
                  ${stat.remarkType === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${stat.remarkType === 'info' ? 'bg-blue-100 text-blue-800' : ''}
                  ${stat.remarkType === 'danger' ? 'bg-red-100 text-red-800' : ''}
                  ${stat.remarkType === 'secondary' ? 'bg-gray-100 text-gray-800' : ''}
                `}>
                  {stat.remark}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DirectoratePerformancePrintableAnalysis stats={stats} />

      {showAnalysis && (
        <DirectoratePerformanceStatsQualitativeAnalysis
          stats={stats}
          onClose={() => setShowAnalysis(false)}
        />
      )}
      {showChart && (
        <DirectoratePerformanceStatsChart
          stats={stats}
          title="توزيع المتوسطات حسب المديريات"
          isDarkMode={isDarkMode}
          onClose={() => setShowChart(false)}
        />
      )}
    </div>
  );
};
//---------------------------------------------------------------------------
// توزيع أفراد العينة حسب المؤشرات النوعية
const MeritTable: React.FC<{ data: Student[]; isDarkMode: boolean }> = ({ data, isDarkMode }) => {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  const stats = useMemo(() => {
    const meritStats: MeritStats[] = [
      { indicator: 'إمتياز', count: data.filter(student => student['معدل ش ت م'] >= 18).length },
      { indicator: 'تهنئة', count: data.filter(student => student['معدل ش ت م'] >= 15 && student['معدل ش ت م'] < 18).length },
      { indicator: 'تشجيع', count: data.filter(student => student['معدل ش ت م'] >= 14 && student['معدل ش ت م'] < 15).length },
      { indicator: 'لوحة شرف', count: data.filter(student => student['معدل ش ت م'] >= 12 && student['معدل ش ت م'] < 14).length },
      { indicator: 'ملاحظة', count: data.filter(student => student['معدل ش ت م'] < 12).length }
    ];

    const total = meritStats.reduce((sum, stat) => sum + stat.count, 0);

    const statsWithPercent = meritStats.map(stat => ({
      ...stat,
      percentage: total > 0 ? ((stat.count / total) * 100).toFixed(1) : '0.00',
    }));

    statsWithPercent.push({ indicator: 'المجموع', count: total, percentage: '100.0' });


    return statsWithPercent;
  }, [data]);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id='Meritstatstitle' className="table-title text-xl font-semibold">توزيع أفراد العينة حسب المؤشرات النوعية</h2>
        <div className="flex gap-2">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-purple-600 hover:text-purple-800"
            title="عرض التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(true)}
            className="p-2 text-blue-600 hover:text-blue-800"
            title="عرض الرسم البياني"
          >
            <BarChart className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => printTable('Meritstatstable', 'Meritstatstitle')}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel('Meritstatstable')}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      <table id='Meritstatstable' className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
          <tr>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>المؤشرات</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>العدد</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>النسبة</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
          {stats.map((stat) => (
            <tr key={stat.indicator}>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.indicator}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.count}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{stat.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <MeritPerformancePrintableAnalysis stats={stats} />
      
      {showAnalysis && (
        <MeritQualitativeAnalysis
          stats={stats}
          onClose={() => setShowAnalysis(false)}
        />
      )}
      {showChart && (
        <MeritChart
          data={stats}
          title="توزيع أفراد العينة حسب المؤشرات النوعية"
          isDarkMode={isDarkMode}
          onClose={() => setShowChart(false)}
        />
      )}
    </div>
  );
};
//---------------------------------------------------------------------------
// أفضل 10 تلاميذ
const TopStudentsTable: React.FC<{ data: Student[]; isDarkMode: boolean }> = ({ data, isDarkMode }) => {
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  const topStudents = useMemo(() => {
    return data
      .filter(student => student['معدل ش ت م'] >= 10)
      .sort((a, b) => b['معدل ش ت م'] - a['معدل ش ت م'])
      .slice(0, 10)
      .map(student => ({
        name: student['اللقب و الاسم'],
        department: student['القسم'],
        certificateGrade: student['معدل ش ت م'],
        annualGrade: student['المعدل السنوي'],
        transitionGrade: student['معدل الإنتقال']
      }));
  }, [data]);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id='TopStudentsstatstitle' className="table-title text-xl font-semibold">ترتيب المتميزين</h2>
        <div className="flex gap-2">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-purple-600 hover:text-purple-800"
            title="عرض التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => printTable('TopStudentsstatstable', 'TopStudentsstatstitle')}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel('TopStudentsstatstable')}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      <table id='TopStudentsstatstable' className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
          <tr>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>الأسم واللقب</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>لقسم</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>معدل الشهادة</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>المعدل السنوي</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>معدل الإنتقال</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
          {topStudents.map((student, index) => (
            <tr key={index}>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{student.name}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{student.department}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{student.certificateGrade}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{student.annualGrade}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{student.transitionGrade}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <TopStudentsPrintableAnalysis students={topStudents} />

      {showAnalysis && (
        <TopStudentsQualitativeAnalysis
          students={topStudents}
          onClose={() => setShowAnalysis(false)}
        />
      )}
    </div>
  );
};
//---------------------------------------------------------------------------
// أدنى 10 تلاميذ
const LowestFailingStudentsTable: React.FC<{ data: Student[]; isDarkMode: boolean }> = ({ data, isDarkMode }) => {
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  const failingStudents = useMemo(() => {
    return data
      .filter(student => student['معدل ش ت م'] < 10)
      .sort((a, b) => a['معدل ش ت م'] - b['معدل ش ت م'])
      .slice(0, 10)
      .map(student => ({
        name: student['اللقب و الاسم'],
        department: student['القسم'],
        certificateGrade: student['معدل ش ت م'],
        annualGrade: student['المعدل السنوي'],
        transitionGrade: student['معدل الإنتقال']
      }));
  }, [data]);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id='LowestFailingStudentsstatstitle' className="table-title text-xl font-semibold">ترتيب أضعف التلاميذ</h2>
        <div className="flex gap-2">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-purple-600 hover:text-purple-800"
            title="عرض التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => printTable('LowestFailingStudentsstatstable', 'LowestFailingStudentsstatstitle')}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel('LowestFailingStudentsstatstable')}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      <table id='LowestFailingStudentsstatstable' className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
          <tr>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>الأسم واللقب</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>لقسم</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>معدل الشهادة</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>المعدل السنوي</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>معدل الإنتقال</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
          {failingStudents.map((student, index) => (
            <tr key={index}>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{student.name}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{student.department}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{student.certificateGrade}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{student.annualGrade}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{student.transitionGrade}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <FailingStudentsPrintableAnalysis students={failingStudents} />

      {showAnalysis && (
        <LowestFailingStudentsQualitativeAnalysis
          students={failingStudents}
          onClose={() => setShowAnalysis(false)}
        />
      )}
    </div>
  );
};
//---------------------------------------------------------------------------
const genderMap: Record<string, string> = {
  male: 'ذكر',
  female: 'أنثى',
  repeat: 'المعيدين',
  nonRepeat: 'غير المعيدين',
};

const StatisticalCountTable: React.FC<{title: string; data: StatisticalCountData | GenderStatisticalCount | RepeatStatisticalCount; isDarkMode: boolean; tableId: string;}> = ({ title, data, isDarkMode, tableId }) => {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const titleId = `${tableId}title`;

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id={titleId} className="table-title text-xl font-semibold">{title}</h2>
        <div className="flex gap-2">
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-purple-600 hover:text-purple-800"
            title="عرض التحليل النوعي"
          >
            <NotebookPen className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(true)}
            className="p-2 text-blue-600 hover:text-blue-800"
            title="عرض الرسم البياني"
          >
            <BarChart className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => printTable(tableId, titleId)}
            className="p-2 text-orange-600 hover:text-orange-800"
            title="طباعة الجدول"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel(tableId)}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      <table id={tableId} className={`printable-table min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
          <tr>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>الفئة</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>العدد</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>النسبة المئوية</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key}>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{genderMap[key] || key}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{value.count}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{value.percentage.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>المجموع</td>
            <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
              {Object.values(data).reduce((sum, v) => sum + v.count, 0)}
            </td>
            <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>100%</td>
          </tr>
        </tfoot>
      </table>
      <StatisticalCountQualitativePrintableAnalysis title={title} data={data} id={`${tableId}Analysis`} />
      {showAnalysis && (
        <StatisticalCountQualitativeAnalysis
          title={title}
          data={data}
          onClose={() => setShowAnalysis(false)}
        />
      )}
      {showChart && (
        <StatisticalCountChart
          data={data}
          title={title}
          isDarkMode={isDarkMode}
          onClose={() => setShowChart(false)}
        />
      )}
    </div>
  );
};

//#endregion

interface ProgressiveDirectiveAnalysisProps {
  data: Student[];
  isDarkMode: boolean;
}

export function AdvanceDirectiveAnalysisPage({ data, isDarkMode }: ProgressiveDirectiveAnalysisProps) {
  // Add state for filter modal
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  // Enrich students with computed fields before filtering
  const enrichedData = useMemo(() => enrichStudentsWithDecisionAndProfile(data), [data]);
  const filters = useFilterStore();
  const subjectTerm = filters.subjectTerm[0] || 'المعدلات السنوية';
  const filteredData = useMemo(() => filterStudents(enrichedData, filters), [enrichedData, filters]);

  // Use our custom hooks to get the statistics
  const subjectStats = useSubjectStats(filteredData, subjectTerm);
  const gradeDistribution = useGradeDistribution(filteredData, subjectTerm);
  const genderStats = useGenderStats(filteredData, subjectTerm);
  const repeatStats = useRepeatStats(filteredData, subjectTerm);

  // Calculate new statistics
  const detailedGradeDistribution = useMemo(() => calculateDetailedGradeDistribution(filteredData), [filteredData]);
  const harmonyStats = useMemo(() => calculateHarmonyStats(filteredData), [filteredData]);
  const categoryStats = useMemo(() => calculateCategoryStats(filteredData), [filteredData]);
  const departmentStats = useMemo(() => calculateDepartmentStats(filteredData), [filteredData]);
  const directorateSubjectStats = useMemo(() => calculateDirectorateSubjectStats(filteredData), [filteredData]);
  const schoolStats = useMemo(() => calculateSchoolStats(filteredData), [filteredData]);
  const directoratePerformanceStats = useMemo(() => calculateDirectoratePerformanceStats(filteredData), [filteredData]);

  // Calculate additional statistics
  const genderStatisticalCount = useMemo(() => calculateGenderStatisticalCount(filteredData), [filteredData]);
  const repeatStatisticalCount = useMemo(() => calculateRepeatStatisticalCount(filteredData), [filteredData]);
  const departmentStatisticalCount = useMemo(() => calculateDepartmentStatisticalCount(filteredData), [filteredData]);
  const schoolStatisticalCount = useMemo(() => calculateSchoolStatisticalCount(filteredData), [filteredData]);
  const directorateStatisticalCount = useMemo(() => calculateDirectorateStatisticalCount(filteredData), [filteredData]);

  return (
    <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex justify-between items-center mt-8 py-8">
        <h2 className="text-2xl font-bold mb-2">تحليل النتائج الفصلية</h2>
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
              className="flex justify-between items-center p-2 px-4 m-4 text-white bg-blue-600 rounded-md hover:text-blue-800 hover:bg-gray-200"
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
        <SubjectStatsTable stats={subjectStats} isDarkMode={isDarkMode} />
      </div>

      {/* Table 2: Grade Distribution */}
      <div className="mb-8">
        <GradeDistributionTable distribution={gradeDistribution} isDarkMode={isDarkMode} />
      </div>

      {/* New Table: Subject Pass Statistics */}
      <div className="mb-8">
        <SubjectPassTable data={filteredData} isDarkMode={isDarkMode} />
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
        <DetailedGradeDistributionTable distribution={detailedGradeDistribution} isDarkMode={isDarkMode} />
      </div>

      {/* Table 7: Harmony Statistics */}
      <div className="mb-8">
        <HarmonyStatsTable stats={harmonyStats} isDarkMode={isDarkMode} />
      </div>

      {/* Table 8: Category Statistics */}
      <div className="mb-8">
        <CategoryStatsTable stats={categoryStats} isDarkMode={isDarkMode} />
      </div>

      {/* Table 10: Department Statistics */}
      {departmentStats.length > 0 && (
        <div className="mb-8">
          <DepartmentStatsTable stats={departmentStats} isDarkMode={isDarkMode} />
        </div>
      )}

      {/* Table 11: Directorate Subject Statistics */}
      {directorateSubjectStats.length > 0 && (
        <div className="mb-8">
          <DirectorateSubjectStatsTable stats={directorateSubjectStats} isDarkMode={isDarkMode} />
        </div>
      )}

      {/* Table 12: School Statistics */}
      <div className="mb-8">
        <SchoolStatsTable stats={schoolStats} isDarkMode={isDarkMode} />
      </div>

      {/* Table 13: Directorate Performance Statistics */}
      <div className="mb-8">
        <DirectoratePerformanceStatsTable stats={directoratePerformanceStats} isDarkMode={isDarkMode} />
      </div>

      {/* Table 14: Gender Statistical Count */}
      <StatisticalCountTable
        title="توزيع أفراد العينة حسب الجنس"
        data={genderStatisticalCount}
        isDarkMode={isDarkMode}
        tableId="Gender-Count-table"
      />

      {/* Table 15: Repeat Statistical Count */}
      <StatisticalCountTable
        title="توزيع أفراد العينة حسب الإعادة"
        data={repeatStatisticalCount}
        isDarkMode={isDarkMode}
        tableId="Repeat-Count-table"
      />

      {/* Table 16: Department Statistical Count */}
      <StatisticalCountTable
        title="توزيع أفراد العينة حسب الأقسام"
        data={departmentStatisticalCount}
        isDarkMode={isDarkMode}
        tableId="Department-Count-table"
      />

      {/* Table 17: School Statistical Count */}
      <StatisticalCountTable
        title="توزيع أفراد العينة حسب المؤسسات"
        data={schoolStatisticalCount}
        isDarkMode={isDarkMode}
        tableId="School-Count-table"
      />

      {/* Table 18: Directorate Statistical Count */}
      <StatisticalCountTable
        title="توزيع أفراد العينة حسب المديريات"
        data={directorateStatisticalCount}
        isDarkMode={isDarkMode}
        tableId="Directorate-Count-table"
      />

      {/* New Table: Merit Statistics */}
      <div className="mb-8">
        <MeritTable data={filteredData} isDarkMode={isDarkMode} />
      </div>

      {/* New Table: Top Students */}
      <div className="mb-8">
        <TopStudentsTable data={filteredData} isDarkMode={isDarkMode} />
      </div>

      {/* New Table: Lowest Failing Students */}
      <div className="mb-8">
        <LowestFailingStudentsTable data={filteredData} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
} 

export type { Student };