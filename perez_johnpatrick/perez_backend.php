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
            $musicId = $_GET['id'];
            $sql = "SELECT * FROM music_table  WHERE id = $musicId";
        } else {
            $sql = "SELECT * FROM music_table ";
        }
        $result = $conn->query($sql);

        $musicList = array();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $musicList[] = $row;
            }
        }

        header('Content-Type: application/json');
        echo json_encode($musicList);
        break;

    case 'POST':
        $title = mysqli_real_escape_string($conn, $_POST['title']);
        $artist = mysqli_real_escape_string($conn, $_POST['artist']);
        $genre = mysqli_real_escape_string($conn, $_POST['genre']);
        $release_year = mysqli_real_escape_string(
            $conn, $_POST['release_year']);
        $album = mysqli_real_escape_string($conn, $_POST['album']);

        $sql = "INSERT INTO music_table  (
            title, artist, genre, release_year, album) 
                VALUES ('$title', '$artist', '$genre', 
                    '$release_year', '$album')";

        if ($conn->query($sql) === TRUE) {
            echo "Music added to your list successfully!";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
        break;

    case 'PATCH':
        parse_str(file_get_contents("php://input"), $patchVars);

        $musicId = $patchVars['id'];
        $title = mysqli_real_escape_string($conn, $patchVars['title']);
        $artist = mysqli_real_escape_string($conn, $patchVars['artist']);
        $release_year = mysqli_real_escape_string
        ($conn, $patchVars['release_year']);
        $genre = mysqli_real_escape_string($conn, $patchVars['genre']);
        $album = mysqli_real_escape_string($conn, $patchVars['album']);

        $sql = "UPDATE music_table  
                    SET title='$title', artist='$artist', 
                    release_year='$release_year',
                    genre='$genre', album='$album' 
                    WHERE id=$musicId";

        if ($conn->query($sql) === TRUE) {
            echo "Music details updated successfully!";
        } else {
            echo "Error updating music list: " . $conn->error;
        }
        break;

    case 'DELETE':
        $musicId = $_GET['id'];
        $sql = "DELETE FROM music_table  WHERE id=$musicId";

        if ($conn->query($sql) === TRUE) {
            echo "Music deleted from the list successfully!";
        } else {
            echo "Error deleting music list: " . $conn->error;
        }
        break;

    case 'OPTIONS':
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods:
        GET, POST, PATCH, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Origin,
        Content-Type, X-Auth-Token");
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