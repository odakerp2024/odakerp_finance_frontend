import { Component, OnInit } from '@angular/core';
/*declare let $: any;*/
@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.css']
})
export class ViewsComponent implements OnInit {

  constructor() { }

    ngOnInit() {

      let inactivityTime = function () {
        let time;
        window.onload = resetTimer;
        document.onload = resetTimer;
        document.onmousemove = resetTimer;
        document.onmousedown = resetTimer; // touchscreen presses
        document.ontouchstart = resetTimer;
        document.onclick = resetTimer; // touchpad clicks
        document.onkeypress = resetTimer;
        document.addEventListener('scroll', resetTimer, true); // improved; see comments
        function logout() {
            var tokenid = localStorage.getItem("TokenID");
            //window.location.href = "https://localhost:44323/views/sessionexpired?Tokenid=" + tokenid;
            window.location.href = "https://navioindia.freighteiz.com/views/sessionexpired?ajhdsvkhabdsucgvaugsdvicugavsdigyaiysgdvicagybsdiucyagiusdygfiuHBSDUCYIAUSDYVBUIAYV=" + tokenid;
            localStorage.removeItem('TokenID');
        }
        function resetTimer() {
            clearTimeout(time);
            time = setTimeout(logout, 1200000)
        }
  
    };
    inactivityTime();
       
  }

    OnsubmitOverlay() {
         $('#overlay').fadeIn().delay(2000).fadeOut();

    }
}
