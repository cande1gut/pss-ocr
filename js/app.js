$(function() {
    $("[data-role='footer']").toolbar().enhanceWithin();
});

$(document).on("pagecontainerchange", function() {
    // Each of the four pages in this demo has a data-pagenum attribute
    // which value is equal to the data-pagenum attribute of the nav button
    var current = $(".ui-page-active").jqmData("pagenum");
    // Remove active class from nav buttons
    $("[data-role='navbar'] a.ui-btn-active").removeClass("ui-btn-active");
    // Add active class to current nav button
    $("[data-role='navbar'] a").each(function() {
        if ( $(this).jqmData("pagenum") == current) {
            $(this).addClass("ui-btn-active");
        }
    });

    if($.mobile.activePage.attr("id") == "amda")
    {
      $("#cB").fadeOut();
    }
    else if($.mobile.activePage.attr("id") == "schedulers")
    {
      $("#cB").fadeIn();
    }
});

var tableText;
var splitedText;
var splitedText2 = [];
var processes;
var processName = [];
var processArrival = [];
var processBurst = [];
var processPriority = [];
var quantum;
var sum = 0;
var sum2 = 0;

function load_file() {
  var reader = new FileReader();
  reader.onload = function(){
    var img = new Image();
    img.src = reader.result;
    img.onload = function(){
      document.getElementById('imageContainer').innerHTML = '';
      document.getElementById('imageContainer').appendChild(img);
      OCRAD(img, function(text){

        $("#select").removeClass("flipOutX");
        $("#select").removeClass("flipInX");
        $("#back").removeClass("flipOutX");
        $("#back").removeClass("flipInX");

        $("#select").addClass("flipOutX");
        setTimeout('$("#select").hide()', 1000);
        setTimeout('$("#back").addClass("flipInX").fadeIn()', 1000);

        $("#fcfs").append("<div id='innerFcfs'></div>");
        $("#sjf").append("<div id='innerSjf'></div>");
        $("#priority").append("<div id='innerPriority'></div>");
        $("#rr").append("<div id='innerRr'></div>");
        $("#innerRr").append("<div id='innerRr2'></div>");

        $("#innerFcfs").append("<h3>First Come First Served</h3>" + "<h5 id='gfcfs'></h5>" + "<h5 id='wfcfs'>Waiting time for</h5>" + "<h5 id='avfcfs'>Average waiting time:</h5>");
        $("#innerSjf").append("<h3>Shortest Job First</h3>" + "<h5 id='gsjf'></h5>" + "<h5 id='wsjf'>Waiting time for</h5>" + "<h5 id='avsjf'>Average waiting time:</h5>");
        $("#innerPriority").append("<h3>Priority</h3>" + "<h5 id='gp'></h5>" + "<h5 id='wp'>Waiting time for</h5>" + "<h5 id='avp'>Average waiting time:</h5>");
        $("#innerRr").css("visibility", "visible");

        tableText = text;
        splitedText = tableText.split("\n");

        for (i=0; i<splitedText.length-1;i++)
        {
          splitedText2.push(splitedText[i].split(" "));
        }

        processes = parseInt(splitedText2.length-1);

        for(i=0;i<splitedText2.length;i++)
        {
          for(j=0;j<splitedText2.length;j++)
          {
            var counter = 1;
            if(splitedText2[i][j] == "Name")
            {
              while(counter <= processes)
              {
                processName.push(splitedText2[counter][j]);
                counter++;
              }
            }
            else if(splitedText2[i][j] == "Arrival")
            {
              while(counter <= processes)
              {
                processArrival.push(splitedText2[counter][j]);
                counter++;
              }
            }
            else if(splitedText2[i][j] == "Burst")
            {
              while(counter <= processes)
              {
                processBurst.push(splitedText2[counter][j]);
                counter++;
              }
            }
            else if(splitedText2[i][j] == "Priorit")
            {
              while(counter <= processes)
              {
                processPriority.push(splitedText2[counter][j]);
                counter++;
              }
            }
          }
        }

        for (var i=0; i<processBurst.length; i++)
        {
            processBurst[i] = parseFloat(processBurst[i]);
            processArrival[i] = parseFloat(processArrival[i]);
            processPriority[i] = parseFloat(processPriority[i]);
        }

        //FCFS
        $("#avfcfs").append(" ( ");
        $("#gfcfs").append(sum + " | ");
        for(i=0;i<processes;i++)
        {
          if(i+1 != processes)
          {
            $("#wfcfs").append(" " + processName[i] + " = " + sum + ",");
            $("#avfcfs").append(sum + " + ");
            sum += processBurst[i];
            sum2 += sum;
            $("#gfcfs").append(processName[i] + " | " + sum + " | ");
          }
          else
          {
            $("#wfcfs").append(" " + processName[i] + " = " + sum);
            $("#avfcfs").append(sum);
            sum += processBurst[i];
            $("#gfcfs").append(processName[i] + " | " + sum);
          }
        }
        $("#avfcfs").append(" ) / " + processes + " = " + (sum2/processes).toFixed(2) + " Milliseconds");
        sum = 0;
        sum2 = 0;

        //SJF
        Array.prototype.min = function() {
          return Math.min.apply(null, this);
        };

        var processName2 = processName.slice();
        var processBurst2 = processBurst.slice();

        $("#avsjf").append(" ( ");
        $("#gsjf").append(sum + " | ");
        for(i=0;i<processes;i++)
        {
          if(i+1 != processes)
          {
            $("#wsjf").append(" " + processName2[processBurst.indexOf(processBurst2.min())] + " = " + sum + ", ");
            $("#avsjf").append(sum + " + ");
            sum += processBurst2.min();
            sum2 += sum;
            $("#gsjf").append(processName2[processBurst.indexOf(processBurst2.min())] + " | " + sum + " | ");
          }
          else
          {
            $("#wsjf").append(processName2[processBurst.indexOf(processBurst2[0])] + " = " + sum);
            $("#avsjf").append(sum);
            sum += processBurst2.min();
            $("#gsjf").append(processName2[processBurst.indexOf(processBurst2.min())] + " | " + sum);
          }
          processName2.splice(processBurst2.indexOf(processBurst2.min()), 1);
          processBurst2.splice(processBurst2.indexOf(processBurst2.min()), 1);
        }
        $("#avsjf").append(" ) / " + processes + " = " + (sum2/processes).toFixed(2) + " Milliseconds");
        sum = 0;
        sum2 = 0;

        //Priority
        var processPriority2 = processPriority.slice();

        $("#avp").append(" ( ");
        $("#gp").append(sum + " | ");
        for(i=0;i<processes;i++)
        {
          if(i+1 != processes)
          {
            $("#wp").append(" " + processName[processPriority.indexOf(processPriority2.min())] + " = " + sum + ",");
            $("#avp").append(sum + " + ");
            sum += processBurst[processPriority.indexOf(processPriority2.min())];
            sum2 += sum;
            $("#gp").append(processName[processPriority.indexOf(processPriority2.min())] + " | " + sum + " | ");
          }
          else
          {
            $("#wp").append(" " + processName[processPriority.indexOf(processPriority2[0])] + " = " + sum);
            $("#avp").append(sum);
            sum += processBurst[processPriority.indexOf(processPriority2.min())];
            $("#gp").append(processName[processPriority.indexOf(processPriority2.min())] + " | " + sum);
          }
          processPriority2.splice(processPriority2.indexOf(processPriority2.min()), 1);
        }
        $("#avp").append(" ) / " + processes + " = " + (sum2/processes).toFixed(2) + " Milliseconds");
        sum = 0;
        sum2 = 0;
      })
    }
  }
  reader.readAsDataURL(document.getElementById('myfile').files[0]);
}

function load_file2() {
  var reader = new FileReader();
  reader.onload = function(){
    var img = new Image();
    img.src = reader.result;
    img.onload = function(){
      document.getElementById('imageContainer').innerHTML = '';
      document.getElementById('imageContainer').appendChild(img);
      OCRAD(img, function(text){

      })
    }
  }
  reader.readAsDataURL(document.getElementById('myfile2').files[0]);
}

  $("#quantum").on("click", function(){
    $("#rr").append("<div id='innerRr2'></div>");
    if(parseInt($("#quantumNumber").val()) != 0 && $("#quantumNumber").val() != "")
    {
      $("#quantumNumber").attr("disabled", true);
      $("#quantum2").removeClass("zoomOut");
      $("#quantum2").removeClass("zoomIn");
      $("#quantum").removeClass("zoomOut");
      $("#quantum").removeClass("zoomIn");

      $("#quantum").addClass("zoomOut");
      setTimeout('$("#quantum").hide()', 1000);
      setTimeout('$("#quantum2").addClass("zoomIn").fadeIn()', 1000);

      $("#innerRr2").append("<h5 id='wrr'>Waiting time for</h5>" + "<h5 id='avrr'>Average waiting time:</h5>");

      //RR
      var quantum = parseInt($("#quantumNumber").val());
      var terminado = false;
      var averageWaitingTime = 0;
      var encontrados = 0;
      var time = 0;
      var served = [processes];
      var burstRobin = processBurst.slice();

      $("#avrr").append(" ( ");
      while (terminado == false)
      {
        encontrados = 0;
        for ( i=0; i<burstRobin.length; i++)
        {
          if (burstRobin[i]!=0)
          {
              if (burstRobin[i]>quantum)
              {
                time = time + quantum;
                burstRobin[i] = burstRobin[i] - quantum;
              }
              else
              {
                time = time + burstRobin[i];
                burstRobin[i] = 0;
                served[i] = time;
              }
          }
        }
        for (j = 0; j<burstRobin.length; j++)
        {
          if (burstRobin[j] == 0)
          {
              encontrados ++;
          }
        }
        if(encontrados == burstRobin.length)
        {
           terminado = true;
        }
      }
      for (i=0; i<served.length; i++)
      {
        averageWaitingTime+=served[i];
      }
      for (i=0; i<processBurst.length; i++)
      {
        averageWaitingTime-=processBurst[i];
      }
      if(served.length != 0)
      {
        averageWaitingTime = averageWaitingTime/served.length;
      }
      for(i=0;i<processes;i++)
      {
        if(i+1 != processes)
        {
          $("#wrr").append(" " + processName[i] + " = " + served[i] + ", ");
          $("#avrr").append(served[i] + " + " + " ");
        }
        else{
          $("#wrr").append(" " + processName[i] + " = " + served[i]);
          $("#avrr").append(served[i] + " )" + " / " + processes + " = " + (averageWaitingTime).toFixed(2) + " Milliseconds");
        }
      }
    }
});

$("#quantum2").on("click", function(){
  quantum = 0;
  terminado = false;
  averageWaitingTime = 0;
  encontrados = 0;
  time = 0;
  served = [processes];
  burstRobin = processBurst.slice();

  $("#quantum2").removeClass("zoomOut");
  $("#quantum2").removeClass("zoomIn");
  $("#quantum").removeClass("zoomOut");
  $("#quantum").removeClass("zoomIn");

  $("#quantum2").addClass("zoomOut");
  setTimeout('$("#quantum2").hide()', 1000);
  setTimeout('$("#quantum").addClass("zoomIn").fadeIn()', 1000);
  $("#innerRr2").remove();

  $("#quantumNumber").val("");
  $("#quantumNumber").attr("disabled", false);
});

$("#adams").click(function(){
  $("#adamResult").append("<div id='innerAdamResult'></div>");
  if(!$("#coresNumber").val() == "" && !$("#serialNumber").val() == "")
  {
    $("#coresNumber, #serialNumber").attr("disabled", true);

    $("#adams").removeClass("zoomOut");
    $("#adams").removeClass("zoomIn");
    $("#clean").removeClass("zoomOut");
    $("#clean").removeClass("zoomIn");

    $("#adams").addClass("zoomOut");
    setTimeout('$("#adams").hide()', 1000);
    setTimeout('$("#clean").addClass("zoomIn").fadeIn()', 1000);

    $("body").css("overflow-y", "visible");
    var cores = parseInt($("#coresNumber").val());
    var serial = parseInt($("#serialNumber").val())/100;
    var adamsL = 1/(serial + (1-serial)/cores);
    $("#innerAdamResult").append("<br>"+ "<b>" + "Speed up <= " + "</b>" + (adamsL).toFixed(2));
  }
  else
  {
    $("#adamResult").html('<div id="alert">Please enter all the necessary values</div>');
    setTimeout('$("#alert").fadeOut()', 1000);
  }
});

$(document).ready(function(){
  $("#back").hide();
  $("#clean").hide();
  $("#quantum2").hide();
});

$("#select").click(function(){
  $("#myfile").click();
  $("body").css("overflow-y", "visible");
});

$("#back").click(function() {
  $("body").css("overflow-y", "hidden");
  $("#myfile").val('');
  $("#quantumNumber").val('');
  tableText = "";
  splitedText = [];
  splitedText2 = [];
  processes = 0;
  processName = [];
  processArrival = [];
  processBurst = [];
  processPriority = [];
  quantum = 0;
  sum = 0;
  sum2 = 0;

  $("#select").removeClass("flipOutX");
  $("#select").removeClass("flipInX");
  $("#back").removeClass("flipOutX");
  $("#back").removeClass("flipInX");

  $("#back").addClass("flipOutX");
  setTimeout('$("#back").hide()', 1000);
  setTimeout('$("#select").addClass("flipInX").fadeIn()', 1000);

  $("#innerFcfs").remove();
  $("#innerSjf").remove();
  $("#innerPriority").remove();
  $("#innerRr").css("visibility", "hidden");
  $("#innerRr2").remove();
  var x = document.getElementById('imageContainer');
  x.removeChild(x.querySelector("img"));
  $("#imageContainer").append("<p style='font-size: 25px'> Open another file or take another picture</p>" + "<p>No file loaded</p>" + "<p style='font-size: 15px'>it's okay. I'll wait. </p>" + "<p style='font-size: 10px'>no seriously, I can't move</p>" + "<p style='font-size: 8px'>still waiting...</p>");
});

$("#clean").click(function(){
  $("body").css("overflow-y", "hidden");
  $("#coresNumber, #serialNumber").attr("disabled", false);

  $("#adams").removeClass("zoomOut");
  $("#adams").removeClass("zoomIn");
  $("#clean").removeClass("zoomOut");
  $("#clean").removeClass("zoomIn");

  $("#clean").addClass("zoomOut");
  setTimeout('$("#clean").hide()', 1000);
  setTimeout('$("#adams").addClass("zoomIn").fadeIn()', 1000);

  $("#innerAdamResult").remove();
  $("#coresNumber").val('');
  $("#serialNumber").val('');
  adamsL = 0;
  cores = 0;
  serial = 0;
  adamsL = 0;
});


function isNumber(evt){
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
