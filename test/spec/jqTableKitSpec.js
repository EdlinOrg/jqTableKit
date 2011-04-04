describe("jqTableKit.formatKey", function() {
	var formatKey = window.formatKey;  	
	
  beforeEach(function() {

  });

  it("can convert formatDateIso", function() {
  	var indata = "2005-03-26T19:51:34Z";
  	var tmp = formatKey(indata,0);  	
  	var d = new Date(tmp);  	
  	var year = d.getFullYear();  
  	expect(year +"").toEqual("2005");
  	expect(formatKey("nodate",0) + "").toEqual("0");
  });

  it("can convert date", function() {
  	var indata = "Mon, 18 Dec 1995 17:28:35 GMT";
  	var tmp = formatKey(indata,1);  	
  	var d = new Date(tmp);  	
  	var year = d.getFullYear();  
  	expect(year +"").toEqual("1995");
  	
  	expect(formatKey("nodate",1) + "").toEqual("0");
  });

  it("can convert date", function() {
  	var indata = "31-12-1999";
  	var typeId = 2;
  	var tmp = formatKey(indata,typeId);  	
  	var d = new Date(tmp);  	
  	var year = d.getFullYear();  
  	expect(year +"").toEqual("1999");
  	
  	expect(formatKey("nodate",typeId) + "").toEqual("0");
  });

  it("can convert date australian", function() {
  	var indata = "25/12/2006 05:30:00 PM";
  	var typeId = 3;
  	var tmp = formatKey(indata,typeId);  	
  	var d = new Date(tmp);  	
  	var year = d.getFullYear();  
  	expect(year +"").toEqual("2006");
  	
  	expect(formatKey("nodate",typeId) + "").toEqual("0");
  });
  
  it("can convert currency", function() {
  	var tmp = formatKey("1999€",5);  	
  	expect(tmp +"").toEqual("1999");  	
  	var tmp = formatKey("1999.23€",5);  	
  	expect(tmp +"").toEqual("1999.23");  	
  });

});

describe("jqTableKit.detectType", function() {
	var detectType = window.detectType;
	
  it("can auto detect dateiso", function() {  	
  	expect(detectType("2005-03-26T19:51:34Z") + "").toEqual("0");
  	expect(detectType("2005-03-26T19:51:34ZAAAAAABBBBBBBBB") + "").toEqual("0");
  });

  it("can auto detect date", function() {  	
  	expect(detectType("Mon, 18 Dec 1995 17:28:35 GMT") + "").toEqual("1");
  	expect(detectType("Mon, 18 Dec 1995 17:28:35 GMT DUMMYTEXT") + "").toEqual("1");
  });
  
  it("can auto detect date-eu", function() {  	
  	expect(detectType("31-03-1999") + "").toEqual("2");
  	expect(detectType("31-3-1999") + "").toEqual("2");
  	expect(detectType("1-3-1999") + "").toEqual("2");
  	expect(detectType("31-03-1999BLAHLABLABLABLALBLA") + "").toEqual("2");
  });

  it("can auto detect date-au", function() {  	
  	expect(detectType("24/10/2005 01:49:41 PM") + "").toEqual("3");
  	expect(detectType("24/10/2005 01:49:41 PM dummytext") + "").toEqual("3");
  });

  it("can auto detect time", function() {  	
  	expect(detectType("12:23") + "").toEqual("4");
  	expect(detectType("12:23 am") + "").toEqual("4");
  });
  
  it("can auto detect currency", function() {  	
  	expect(detectType("$200.00") + "").toEqual("5");
  	expect(detectType("$200.03") + "").toEqual("5");
  	expect(detectType("¥200") + "").toEqual("5");
  	expect(detectType("£200") + "").toEqual("5");
  	expect(detectType("¤200") + "").toEqual("5");
  	expect(detectType("€200") + "").toEqual("5");
  	expect(detectType("200€") + "").toEqual("5");  	  	
  });

  it("can auto detect datasize", function() {  	
  	expect(detectType("1.3kB") + "").toEqual("6");
  	expect(detectType("1.3mB") + "").toEqual("6");
  	expect(detectType("1GB") + "").toEqual("6");
  	expect(detectType("1.3GB") + "").toEqual("6");
  	expect(detectType("1.3tB") + "").toEqual("6");
  });
  
  it("can auto detect numbers", function() {  	
  	expect(detectType("1") + "").toEqual("7");
  	expect(detectType("+1") + "").toEqual("7");
  	expect(detectType("-1") + "").toEqual("7");
  	expect(detectType("1.123") + "").toEqual("7");
  	expect(detectType("-1.123") + "").toEqual("7");
  });
  

  it("can auto detect text", function() {  	
  	expect(detectType("a-1.123") + "").toEqual("9");

  	expect(detectType("we12:23") + "").toEqual("9");
  	expect(detectType("12:23 amm") + "").toEqual("9");
  });

});