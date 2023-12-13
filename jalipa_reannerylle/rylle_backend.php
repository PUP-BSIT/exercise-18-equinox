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
            $pokemonId = mysqli_real_escape_string($conn, $_GET['id']);
            $sql = "SELECT * FROM pokemon_table WHERE id = $pokemonId";
        } else {
            $sql = "SELECT * FROM pokemon_table";
        }

        $result = $conn->query($sql);

        $pokemonList = array();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $pokemonList[] = $row;
            }
        }

        header('Content-Type: application/json');
        echo json_encode($pokemonList);
        break;

    case 'POST':
        $name = mysqli_real_escape_string($conn, $_POST['name']);
        $type = mysqli_real_escape_string($conn, $_POST['type']);
        $level = mysqli_real_escape_string($conn, $_POST['level']);
        $ability = mysqli_real_escape_string($conn, $_POST['ability']);
        $location = mysqli_real_escape_string($conn, $_POST['location']);

        $sql = "INSERT INTO pokemon_table 
        (name, type, level, ability, location) 
                VALUES ('$name', '$type', '$level', '$ability', '$location')";

        if ($conn->query($sql) === TRUE) {
            echo "Pokemon added to your list successfully!";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
        break;

    case 'PATCH':
        parse_str(file_get_contents("php://input"), $patchVars);

        $pokemonId = isset($patchVars['id']) ?
            mysqli_real_escape_string($conn, $patchVars['id']) : null;

        if ($pokemonId !== null) {
        ;$name = mysqli_real_escape_string($conn, $patchVars['name']);
        ;$type = mysqli_real_escape_string($conn, $patchVars['type']);
        ;$level = mysqli_real_escape_string($conn, $patchVars['level']);
        ;$ability = mysqli_real_escape_string($conn, $patchVars['ability']);
        ;$location = mysqli_real_escape_string($conn, $patchVars['location']);

       ;$stmt = $conn->prepare("UPDATE pokemon_table 
                            ;SET name=?, 
                            ;type=?, 
                            ;level=?, 
                            ;ability=?, 
                            ;location=? 
                            ;WHERE id=?");

            $stmt->bind_param("sssssi", $name, $type, $level, $ability, 
            $location, $pokemonId);

            if ($stmt->execute()) {
                echo "Pokemon details updated successfully!";
            } else {
                echo "Error updating pokemon list: " . $stmt->error;
            }

            $stmt->close();
        } else {
            echo "Error: Pokemon ID is missing.";
        }

        break;

    case 'DELETE':
        $pokemonId = isset($_GET['id']) ?
            mysqli_real_escape_string($conn, $_GET['id']) : null;

        if ($pokemonId !== null) {
            $sql = "DELETE FROM pokemon_table WHERE id=$pokemonId";

            if ($conn->query($sql)) {
                echo "Pokemon deleted from the list successfully!";
            } else {
                echo "Error deleting pokemon list: " . $conn->error;
            }
        } else {
            echo "Error: Pokemon ID is missing.";
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
?>