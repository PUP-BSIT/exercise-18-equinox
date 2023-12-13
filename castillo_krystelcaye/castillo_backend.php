<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token");

$host = "127.0.0.1:3306";
$username = "u733671518_user_wibs";
$password = "/f9rfuA|U";
$database = "u733671518_exercise_18";

$conn = new mysqli($host, $username, $password, $database);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $kdramaId = $_GET['id'];
            $sql = "SELECT * FROM kdrama_series_table WHERE id = $kdramaId";
        } else {
            $sql = "SELECT * FROM kdrama_series_table";
        }
        $result = $conn->query($sql);

        $kdramaList = array();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $kdramaList[] = $row;
            }
        }

        header('Content-Type: application/json');
        echo json_encode($kdramaList);
        break;

    case 'POST':
        $title = mysqli_real_escape_string($conn, $_POST['title']);
        $cast = mysqli_real_escape_string($conn, $_POST['cast']);
        $genre = mysqli_real_escape_string($conn, $_POST['genre']);
        $release_year = mysqli_real_escape_string(
            $conn, $_POST['release_year']);
        $rating = mysqli_real_escape_string($conn, $_POST['rating']);

        $sql = "INSERT INTO kdrama_series_table (
            title, cast, genre, release_year, rating) 
                VALUES ('$title', '$cast', '$genre', 
                    '$release_year', '$rating')";

        if ($conn->query($sql) === TRUE) {
            echo "Kdrama added to your list successfully!";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
        break;

    case 'PATCH':
        parse_str(file_get_contents("php://input"), $patchVars);

        $kdramaId = $patchVars['id'];
        $title = mysqli_real_escape_string($conn, $patchVars['title']);
        $cast = mysqli_real_escape_string($conn, $patchVars['cast']);
        $genre = mysqli_real_escape_string($conn, $patchVars['genre']);
        $release_year = mysqli_real_escape_string(
            $conn, $patchVars['release_year']);
        $rating = mysqli_real_escape_string($conn, $patchVars['rating']);

        $sql = "UPDATE kdrama_series_table 
                    SET title='$title', cast='$cast', 
                    genre='$genre', release_year='$release_year',
                     rating='$rating' 
                    WHERE id=$kdramaId";

        if ($conn->query($sql) === TRUE) {
            echo "Kdrama details updated successfully!";
        } else {
            echo "Error updating kdrama list: " . $conn->error;
        }
        break;

    case 'DELETE':
        $kdramaId = $_GET['id'];
        $sql = "DELETE FROM kdrama_series_table WHERE id=$kdramaId";

        if ($conn->query($sql) === TRUE) {
            echo "Kdrama deleted from the list successfully!";
        } else {
            echo "Error deleting kdrama list: " . $conn->error;
        }
        break;

    case 'OPTIONS':
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT,
             DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Origin, Content-Type,
             X-Auth-Token");
        header('Content-Type: application/json');
        http_response_code(200);
        break;

    default:
        http_response_code(405); 
        echo "Invalid request method";
        break;
}

$conn->close();
?>
