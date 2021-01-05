<?php
require 'includes/common.php';
if (isset($_SESSION['enrolno'])) {
  header('location:studentProfile.php');
} 
if (isset($_SESSION['employeeCode'])) {
  header('location:facultyProfile.php');
}
else {
  // echo "<div class='h5'>Hello Guest</div>";
}
?>
<html>

<head>
  <title>Homepage</title>
  <style>
    #banner_image {
      padding-top: 75px;
      padding-bottom: 50px;
      text-align: center;
      color: #f8f8f8;
      background: url('images/intro-bg_1.jpg') no-repeat center center;
      background-size: cover;
    }

    label {
      font-weight: bold;
      font-size: 14px;
    }
  </style>
  <script>
    var loginFlag=1;
    function changeLoginType(){
      if(loginFlag){
        document.getElementById("studentLogin").style.display='none';
        document.getElementById("facultyLogin").style.display='block';
        loginFlag=0;
      }
      else{
        document.getElementById("studentLogin").style.display='block';
        document.getElementById("facultyLogin").style.display='none';
        loginFlag=1;
      }
    }
    </script>
</head>

<body>
  <div class="page-container" style="background-color:#2B3137;">
    <?php
    include 'includes/header.php';
    ?>
    <div class="container" style="padding-bottom:60px;">
      <div class="row">
        <div class="col-sm-12 col-lg-5 p-5">
          <div class="h1 mt-5 text-light">
            GitHub for Jaypee
          </div>
          <span class="text-secondary">
            Built by Jaypee students for Jaypee students,where you can host and review code, manage
            projects, and build software alongside fellow developers
          </span>
        </div>
        <div class="col-2"></div>
        <div class="col-sm-12 col-lg-5 col-5">
          <div class="card mt-4 shadow">
            <div class="card-body" id="studentLogin">
              <span class="text-muted">Student Login</span>
              <button class="btn btn-sm btn-link float-right" onclick="changeLoginType();">Faculty Login</button><hr>
              <form method="POST" action="login_student.php">
                <!-- <div class="form-group">
                  <label for="exampleInputEmail1">Email address</label>
                  <input type="email" class="form-control form-control-lg" id="email" name="email" aria-describedby="emailHelp">
                  <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                </div> -->
                <div class="form-group">
                  <label for="enrolno">Enrollment number</label>
                  <input type="text" class="form-control form-control-lg" id="enrolno" name="enrolno" aria-describedby="emailHelp">
                </div>
                <div class="form-group">
                  <label for="dob">Date of birth</label>
                  <input type="date" class="form-control form-control-lg" name="dob" id="dob">
                </div>
                <div class="form-group">
                  <label for="password">Password</label>
                  <input type="password" class="form-control form-control-lg" name="password" id="password">
                </div>
                <!-- <small class="text-muted mr-1">Forgot your password?</small>
                <button type="button" style ="border-radius:50%;width:30px;font-weight:bold;" class="btn btn-outline-danger btn-sm btn-circle" data-toggle="tooltip" data-placement="right" title="Contact your network admin">
                  ?
                </button> -->
                <button type="submit" class="btn btn-primary btn-block btn-lg mt-4 p-3">Sign in</button>
              </form>
            </div>
            <div class="card-body" id="facultyLogin" style="display:none;">
            <span class="text-muted">Faculty Login</span>
              <button class="btn btn-sm btn-link float-right" onclick="changeLoginType();">Student Login</button><hr>
              <form method="POST" action="login_faculty.php">
                <!-- <div class="form-group">
                  <label for="exampleInputEmail1">Email address</label>
                  <input type="email" class="form-control form-control-lg" id="email" name="email" aria-describedby="emailHelp">
                  <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                </div> -->
                <div class="form-group">
                  <label for="employeeCode">Employee Code</label>
                  <input type="text" class="form-control form-control-lg" id="employeeCode" name="employeeCode" aria-describedby="emailHelp">
                </div>
                <div class="form-group">
                  <label for="facultyPassword">Password</label>
                  <input type="password" class="form-control form-control-lg" name="facultyPassword" id="facultyPassword">
                </div>
                <!-- <small class="text-muted mr-1">Forgot your password?</small>
                <button type="button" style ="border-radius:50%;width:30px;font-weight:bold;" class="btn btn-outline-danger btn-sm btn-circle" data-toggle="tooltip" data-placement="right" title="Contact your network admin">
                  ?
                </button> -->
                <button type="submit" class="btn btn-primary btn-block btn-lg mt-4 p-3">Sign in</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <?php
    include 'includes/footer.php';
    ?>
  </div>
  <script>
    
    $(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
    </script>
</body>

</html>