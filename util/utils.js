const convertDateBR = (dataOriginal) => {
    if (dataOriginal != null && dataOriginal != undefined ) {
        const ano = dataOriginal.getFullYear();
        const mes = String(dataOriginal.getMonth() + 1).padStart(2, '0');
        const dia = String(dataOriginal.getDate()).padStart(2, '0');

        const dataFormatada = `${dia}/${mes}/${ano}`;

        return dataFormatada;
    }
    return '';
};


function parseDate(dataString) {
    // Divida a string da data em ano, mês e dia usando split
    var partesData = dataString.split('-');
  
    // Construa o objeto Date
    // Lembre-se de subtrair 1 do mês, pois em JavaScript os meses são indexados de 0 a 11
    var data = new Date(parseInt(partesData[0]), parseInt(partesData[1]) - 1, parseInt(partesData[2]));
  
    return data;
  }
  

export { convertDateBR, parseDate }; // Exporta o método convertDateBR para ser usado em outros arquivos
