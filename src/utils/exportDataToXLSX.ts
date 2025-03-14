const exportDataToXLSX = (data: any[]) => {
    const formattedData = data.map(item => {
        return {
            // other fields...
            'مهنة الاب': item['مهنة الاب'] ? item['مهنة الاب'].value : '', // Ensure select field is captured
            'المستوى الدراسي للأب': item['المستوى الدراسي للأب'] ? item['المستوى الدراسي للأب'].value : '',
            'هل الأب متوفي': item['هل الأب متوفي'] ? item['هل الأب متوفي'].value : '',
            'الجنس': item['الجنس'] ? item['الجنس'].value : '',
            'الإعادة': item['الإعادة'] ? item['الإعادة'].value : '',
            'القسم': item['القسم'] ? item['القسم'].value : '',
            // Add other select fields as necessary
        };
    });

    // Code to create and download the XLSX file...
}; 