function toWords(number) {
    
    //is merely seconds, just return rounded numebr
    if(number<120){
         return getNumberWords(number, true)+" секунд(и)";
    }
    var hour = 60*60;
    if(number<hour){
        minutes = number/60;
         return  getNumberWords(minutes, true)+" хвилин(и)";
    }
    
    var day = hour * 24;
    if(number<(2*day)){
        hours = number/hour;
         return  getNumberWords(hours)+" годин(и)";
    }
    
    var month = day * 30;
    if(number<month){
        days = number/day;
         return  getNumberWords(days)+" дні(в)";
    }
    
    var year = day * 365;
    if(number<year){
        months = number/month;
         return  getNumberWords(months)+" місяці(в)";
    }
    
    var century = year * 100;
    if(number<century*10){
      years = number/year;
        return  getNumberWords(years)+" роки(ів)";
    }
    
    if(number<century*100){
     centuries = number/century;
     return  getNumberWords(centuries)+" століть(я)";
     }
     
      years = number/year;
        return  getNumberWords(years)+" роки(ів)";
}

function getNumberWords(number, twoDP){
   var numberWords = "";
   
   var trillion = Math.pow(10, 12);
   var billion = Math.pow(10, 9);
   var million = Math.pow(10, 6);
   var thousand = Math.pow(10, 4);
   var hundred = Math.pow(10, 3);
   
   
   while(number/trillion >= 1){
       numberWords = " трильйони(ів) " + numberWords;
       number = number/trillion;
   }
   
   while(number/billion >= 1){
       numberWords = " мілярди(ів) " + numberWords;
       number = number/billion;
   }
   
   while(number/million >= 1){
       numberWords = " мільйонів " + numberWords;
       number = number/million;
   }
   
   while(number/thousand >= 1){
       numberWords = " тисяч " + numberWords;
       number = number/thousand;
   }
   
   while(number/hundred >= 1){
       numberWords = " сотня " + numberWords;
       number = number/hundred;
   }
   
   if(twoDP){
       decimalPoint = 100;
   }else{
        decimalPoint = 1;
   }
   number = (Math.round(number*decimalPoint)/decimalPoint)
   
   numberWords = number + numberWords;
       
   return numberWords;
}