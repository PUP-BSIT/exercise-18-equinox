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
            $animeId = mysqli_real_escape_string($conn, $_GET['id']);
            $sql = "SELECT * FROM anime_table WHERE id = $animeId";
        } else {
            $sql = "SELECT * FROM anime_table";
        }

        $result = $conn->query($sql);

        $animeList = array();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $animeList[] = $row;
            }
        }

        header('Content-Type: application/json');
        echo json_encode($animeList);
        break;

    case 'POST':
        $title = mysqli_real_escape_string($conn, $_POST['title']);
        $author = mysqli_real_escape_string($conn, $_POST['author']);
        $studio = mysqli_real_escape_string($conn, $_POST['studio']);
        $yearReleased = 
        mysqli_real_escape_string($conn, $_POST['year_released']);
        $seasons = mysqli_real_escape_string($conn, $_POST['seasons']);
        $episodes = mysqli_real_escape_string($conn, $_POST['episodes']);

        $sql = "INSERT INTO anime_table (
            title, 
            author, 
            studio, 
            year_released, 
            seasons, 
            episodes) 
                VALUES ('$title', 
                '$author', 
                '$studio', 
                '$yearReleased', 
                '$seasons', 
                '$episodes')";

        if ($conn->query($sql)) {
            echo "Anime added to your list successfully!";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
        break;

    case 'PATCH':
        parse_str(file_get_contents("php://input"), $patchVars);

        $animeId = isset($patchVars['id']) ? 
        mysqli_real_escape_string($conn, $patchVars['id']) : null;

        if ($animeId !== null) {
            $title = mysqli_real_escape_string(
                $conn, $patchVars['title']);
            $author = mysqli_real_escape_string(
                $conn, $patchVars['author']);
            $studio = mysqli_real_escape_string(
                $conn, $patchVars['studio']);
            $yearReleased = mysqli_real_escape_string(
                $conn, $patchVars['year_released']);
            $seasons = mysqli_real_escape_string(
                $conn, $patchVars['seasons']);
            $episodes = mysqli_real_escape_string(
                $conn, $patchVars['episodes']);

            $stmt = $conn->prepare("UPDATE anime_table 
                                   SET title=?, 
                                   author=?, 
                                   studio=?, 
                                   year_released=?, 
                                   seasons=?, 
                                   episodes=? 
                                   WHERE id=?");

            $stmt->bind_param("ssssiii", 
            $title, 
            $author, 
            $studio, 
            $yearReleased, 
            $seasons, 
            $episodes, 
            $animeId);

            if ($stmt->execute()) {
                echo "Anime details updated successfully!";
            } else {
                echo "Error updating anime list: " . $stmt->error;
            }

            $stmt->close();
        } else {
            echo "Error: Anime ID is missing.";
        }

        break;

    case 'DELETE':
        $animeId = isset($_GET['id']) ? 
        mysqli_real_escape_string($conn, $_GET['id']) : null;

        if ($animeId !== null) {
            $sql = "DELETE FROM anime_table WHERE id=$animeId";

            if ($conn->query($sql)) {
                echo "Anime deleted from the list successfully!";
            } else {
                echo "Error deleting anime list: " . $conn->error;
            }
        } else {
            echo "Error: Anime ID is missing.";
        }
        break;

    case 'OPTIONS':
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET, 
        POST, 
        PATCH, 
        PUT, 
        DELETE, 
        OPTIONS");
        header("Access-Control-Allow-Headers: Origin, 
        Content-Type, 
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
