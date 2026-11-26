(function(){
  var start = new Date("2027-01-30T14:00:00Z"); // 15:00 czasu warszawskiego
  var el = document.getElementById("count");
  var days = Math.ceil((start - new Date()) / 86400000);
  if (days > 1) el.textContent = "Do wydarzenia zostało " + days + " dni.";
  else if (days === 1) el.textContent = "Widzimy się jutro o 15:00.";
  else if (days === 0) el.textContent = "To już dziś – start o 15:00.";
  else el.textContent = "Dziękujemy za udział w FUTURE@WORK 2027.";

  function ics(){
    var body = [
      "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//FUTURE@WORK//PL","BEGIN:VEVENT",
      "UID:futureatwork-2027@futureatwork","DTSTAMP:20261126T120000Z",
      "DTSTART:20270130T140000Z",
      "URL:https://futureatwork-2027.vercel.app/",
      "SUMMARY:FUTURE@WORK 2027",
      "DESCRIPTION:Cyberbezpieczeństwo\\, HR\\, employer branding i rynek pracy. 20 paneli tematycznych.",
      "LOCATION:Centrum Konferencyjne West Gate\\, Warszawa",
      "END:VEVENT","END:VCALENDAR"
    ].join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], {type:"text/calendar;charset=utf-8"}));
    a.download = "future-at-work-2027.ics";
    document.body.appendChild(a); a.click(); a.remove();
  }
  document.getElementById("ics").addEventListener("click", ics);
  document.getElementById("ics2").addEventListener("click", ics);
})();
