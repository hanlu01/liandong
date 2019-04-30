
 var vcity=[11,12,13,14,15,21,22,23,31,32,33,34,35,36,37,41, 
		    42,43,44,45,46,50,51,52,53,54,61,62,63,64,65,71,81,82,91];
 
 /*var vcity={ 11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古", 
		    21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏", 
		    33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南", 
		    42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆", 
		    51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃", 
		    63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"
		   };*/
 export function scCard(cardNumber){
  var scCard = cardNumber.toUpperCase();
  if(scCard.length!=0){
	  var flag = checkCard(scCard);
      if(!checkCard(scCard)){ 
    	  return false;
      }else{
    	  return true;
      }
  }else{
	  return false;
  }

function checkCard(obj){ 
  var isPassport = false;
  //校验长度，类型 
  if(isCardNo(obj) === false){
      return false;
  }
  if(!isPassport){
	  //检查省份 
	  if(checkProvince(obj) === false){ 
		  return false; 
	  } 
	  //校验生日 
	  if(checkBirthday(obj) === false){ 
		  return false; 
	  } 
	  //检验位的检测 
	  if(checkParity(obj) === false){ 
		  return false; 
	  } 
  }
  return true; 
 }; 
 //检查号码是否符合规范，包括长度，类型 
function isCardNo(obj){ 
  //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
	  var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/; 
	  if(reg.test(obj) === false){ //身份证校验失败，在进行护照校验
		 return false; 
	  } 
  	  return true; 
 }; 

 //取身份证前两位,校验省份 
function checkProvince(obj){
  var province = obj.substr(0,2); 
  if(vcity.indexOf(province) > -1){ 
	  return false; 
  } 
  	return true; 
 }; 
 //检查生日是否正确 
function checkBirthday(obj){
  var len = obj.length; 
  //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字 
  if(len == '15'){ 
   var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/; 
   var arr_data = obj.match(re_fifteen); 
   var year = arr_data[2]; 
   var month = arr_data[3]; 
   var day = arr_data[4]; 
   var birthday = new Date('19'+year+'/'+month+'/'+day); 
   return verifyBirthday('19'+year,month,day,birthday); 
  } 
  //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X 
  if(len == '18'){ 
	   var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/; 
	   var arr_data = obj.match(re_eighteen); 
	   var year = arr_data[2]; 
	   var month = arr_data[3]; 
	   var day = arr_data[4]; 
	   var birthday = new Date(year+'/'+month+'/'+day); 
	   return verifyBirthday(year,month,day,birthday); 
  } 
  	return false; 
 }; 
 //校验日期 
function verifyBirthday(year,month,day,birthday){
  var now = new Date(); 
  var now_year = now.getFullYear(); 
  //年月日是否合理 
  if(birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) 
  { 
   //判断年份的范围（3岁到100岁之间) 
   var time = now_year - year; 
   if(time >= 0 && time <= 130) 
   { 
    return true; 
   } 
   return false; 
  } 
  return false; 
 }; 
 //校验位的检测 
function checkParity(obj){
  //15位转18位 
  obj = changeFivteenToEighteen(obj); 
  var len = obj.length; 
  if(len == '18'){ 
   var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); 
   var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); 
   var cardTemp = 0, i, valnum; 
   for(i = 0; i < 17; i ++){ 
    cardTemp += obj.substr(i, 1) * arrInt[i]; 
   } 
   valnum = arrCh[cardTemp % 11]; 
   if (valnum == obj.substr(17, 1)) 
   { 
    return true; 
   } 
   return false; 
  } 
  return false; 
 }; 
 //15位转18位身份证号 
function changeFivteenToEighteen(obj){
  if(obj.length == '15'){ 
   var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); 
   var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); 
   var cardTemp = 0, i;  
   obj = obj.substr(0, 6) + '19' + obj.substr(6, obj.length - 6); 
   for(i = 0; i < 17; i ++){ 
    cardTemp += obj.substr(i, 1) * arrInt[i]; 
   } 
   obj += arrCh[cardTemp % 11]; 
   return obj; 
  } 
  return obj; 
 };
}
