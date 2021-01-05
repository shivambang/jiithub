<?php
function check_if_added_to_cart($item_id){
    require "common.php";
    if(isset($_SESSION['id'])){
        $user_id=$_SESSION['id'];
    }
    $query = "SELECT * FROM user_products WHERE products_id='$item_id' AND user_id ='$user_id' AND status='Added to cart'";
    $query_result=  mysqli_query($link, $query) or die(mysqli_error($link));
    $number_rows=  mysqli_num_rows($query_result);
    if($number_rows>=1) return 1;
    else        return 0;
}
?>
