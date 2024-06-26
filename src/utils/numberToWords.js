// src/utils/numberToWords.js

const numberToWords = (num) => {
    const ones = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
    const toWords = (n) => {
      if (n < 20) return ones[n];
      const digit = n % 10;
      if (n < 100) return tens[Math.floor(n / 10)] + (digit ? ' ' + ones[digit] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 === 0 ? '' : ' and ' + toWords(n % 100));
      return toWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + toWords(n % 1000) : '');
    };
  
    if (num === 0) return 'Zero';
    return toWords(num);
  };
  
  export default numberToWords;
  