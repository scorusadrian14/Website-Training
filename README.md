<script>
     function adjustBodyPadding() {
       const navbar = document.querySelector('.navbar');
       if (navbar) {
         document.body.style.paddingTop = navbar.offsetHeight + 'px';
       }
     }
     // Run on load and when window resizes
     window.addEventListener('load', adjustBodyPadding);
     window.addEventListener('resize', adjustBodyPadding);
     adjustBodyPadding();
   </script>
