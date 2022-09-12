const router = require("express").Router();
const controller = require("../Controller/todo_controller");

router.route("/")
.get(controller.getTodo)
.post(controller.postTodo);

router.get("/page",controller.getTodoPagination);


router.route("/:id")
.get(controller.getTodoById)
.delete(controller.deleteTodoById)
.put(controller.updateTodoById);

module.exports = router;