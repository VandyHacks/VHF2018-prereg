import Vue from 'vue'
import EmailField from './EmailField.vue'
import Typeahead from './Typeahead.vue'
// import VueResource from 'vue-resource'
// Vue.use(VueResource);

setTimeout(() => {
    // Workaround Chrome animated GIF bug
    var logoEl = document.getElementById('logo');
    var imageUrl = logoEl.src;
    logoEl.src = '#';
    logoEl.src = imageUrl;
    // Opacity and scale
    var appEl = document.getElementById('app');
    appEl.style.opacity = '1';
    appEl.style.transform = 'scale(1)';
    document.getElementById("date").className += " lines";
}, 5);

var app = new Vue({
    el: "#app",
    components: { 'typeahead': Typeahead, 'email': EmailField },
    data: {
        isMounted: false
    },
    mounted() {
        this.isMounted = true;
    },
    computed: {
        areInputsValid() {
            return this.isMounted &&
                this.$refs.emailField.isEmailInputValid && this.$refs.universityAutofill.isUniversityInputValid;
        }
    },
    methods: {
        registerEmail() {
          // grab email from input
          window.alert('Email: ' + this.$refs.emailField.email + ", University: " + this.$refs.universityAutofill.query);
          console.log('registerEmail test...');

          // test to see if endpoint.php was reached
          /*$.ajax({
            url: "endpoint.php",
            success: function(){
              console.log("works for real");
            },
            error: function(){
              console.log("fail");
            }
          })*/

          // store data to send to Mailchip
          // modified from http://nobleintentstudio.com/blog/mailchimp-api-example/
          /*var data = {
            email: email,
            status: "subscribed"
          };

          // endpoint file
          var endpoint = "endpoint.php";
          console.log(data);
          console.log(endpoint);

          //make the ajax request
          $.ajax({
            method: 'POST',
            dataType: "json",
            url: "js/endpoint.php",
            data: data,
            success: function(data){
              if(data.id){
                //successful adds will have an id attribute on the object
                alert('thanks for signing up');
              } else if (data.title == 'Member Exists') {
                alert('thanks, but you are alredy signed up');
              } else {
                //something went wrong with the API call
                alert('oh no, there has been a problem (api call)');
              }
            },
            error: function(){
              alert('oh no, there has been a problem (server problem)');
            }
          });*/

          // old code that tried to send information w/o php (not allowed
          // for security reasons from mailchimp)
          /*$(document).ready(function(){
            var mcForm = $('#mailchimpForm');
            var dc = 'us9';
            var id = '5a2fc7077d';
            var url = '//' + dc + '.api.mailchimp.com/3.0/list/' + id + '/members/';
            var key = "2c364b1b877fda458de3b00f5410b3a3-us9";
            var data = {
              "email_address": email,
              "status": "subscribed"
            };

            var params = JSON.stringify(data);

            $.ajax({
              url: url,
              method: 'POST',
              data: params,
              dataType: 'json',
              contentType: 'application/json; charset=utf-8',
              beforeSend: function(xhr){
                xhr.setRequestHeader("Authorization", "Basic" + btoa("api:" + key));
              },
              error: function(res, text){
                alert('error');
              },
              success: function(res){
                alert('error');
              }
            });
          });*/
        }
    }
});
