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
            $movieId = mysqli_real_escape_string($conn, $_GET['id']);
            $sql = "SELECT * FROM movies_table WHERE id = $movieId";
        } else {
            $sql = "SELECT * FROM movies_table";
        }

        $result = $conn->query($sql);

        $movieList = array();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $movieList[] = $row;
            }
        }

        header('Content-Type: application/json');
        echo json_encode($movieList);
        break;

    case 'POST':
        $title = mysqli_real_escape_string($conn, $_POST['title']);
        $director = mysqli_real_escape_string($conn, $_POST['director']);
        $genre = mysqli_real_escape_string($conn, $_POST['genre']);
        $year = mysqli_real_escape_string($conn, $_POST['year']);
        $views = mysqli_real_escape_string($conn, $_POST['views']);

        $sql = "INSERT INTO movies_table (title, director, genre, year, views) 
                VALUES ('$title', '$director', '$genre', '$year', '$views')";

        if ($conn->query($sql)) {
            echo "Movie added to your list successfully!";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
        break;

    case 'PATCH':
        parse_str(file_get_contents("php://input"), $patchVars);

        $movieId = isset($patchVars['id']) ? 
        mysqli_real_escape_string($conn, $patchVars['id']) : null;

        if ($movieId !== null) {
            $title = mysqli_real_escape_string($conn, $patchVars['title']);
            $director = mysqli_real_escape_string($conn, 
            $patchVars['director']);
            $genre = mysqli_real_escape_string($conn, $patchVars['genre']);
            $year = mysqli_real_escape_string($conn, $patchVars['year']);
            $views = mysqli_real_escape_string($conn, $patchVars['views']);

            $stmt = $conn->prepare("UPDATE movies_table 
                                   SET title=?, 
                                   director=?, 
                                   genre=?, 
                                   year=?, 
                                   views=? 
                                   WHERE id=?");

            $stmt->bind_param("sssssi", $title, $director, 
            $genre, $year, $views, $movieId);

            if ($stmt->execute()) {
                echo "Movie details updated successfully!";
            } else {
                echo "Error updating movie list: " . $stmt->error;
            }

            $stmt->close();
        } else {
            echo "Error: Movie ID is missing.";
        }

        break;

    case 'DELETE':
        $movieId = isset($_GET['id']) ? 
        mysqli_real_escape_string($conn, $_GET['id']) : null;

        if ($movieId !== null) {
            $sql = "DELETE FROM movies_table WHERE id=$movieId";

            if ($conn->query($sql)) {
                echo "Movie deleted from the list successfully!";
            } else {
                echo "Error deleting movie list: " . $conn->error;
            }
        } else {
            echo "Error: Movie ID is missing.";
        }
        break;

    case 'OPTIONS':
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: 
        GET, POST, PATCH, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: 
        Origin, Content-Type, X-Auth-Token");
        header('Content-Type: application/json');
        http_response_code(200);
        break;

    default:
        http_response_code(405);
        echo "Invalid request method";
        break;
}

$conn->close();
