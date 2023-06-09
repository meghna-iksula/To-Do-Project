export default () => ({
  page: location.hash,
  todoData: {},
  individualTodoData: {},
  isLoading: null,
  async init() {
    try {
      this.isLoading = true;
      const data = await (
        await fetch(
          "https://react-http-65441-default-rtdb.firebaseio.com//todo.json"
        )
      ).json();
      this.todoData = this.addIdInData(data);
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  },

  todoClickHandler(todoId) {
    location.hash = `todo?id=${todoId}`;
  },

  addIdInData(data) {
    let dataWithId = [];
    for (let index in data) {
      dataWithId.push({ id: index, ...data[index] });
    }
    return dataWithId;
  },

  async deleteDataInFirebase() {
    const todoParams = Object.fromEntries(new URLSearchParams(location.hash));
    todoParams["id"] = todoParams["#todo?id"];
    try {
      if (todoParams.id) {
        await fetch(
          `https://react-http-65441-default-rtdb.firebaseio.com//todo/${todoParams.id}.json`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
      await this.init();
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoading = false;
      location.href = "main.html#sticky-wall";
    }
  },

  async loadTodo() {
    const todoParams = Object.fromEntries(new URLSearchParams(location.hash));
    todoParams["id"] = todoParams["#todo?id"];
    try {
      if (todoParams.id) {
        this.isLoading = true;
        const todoData = await fetch(
          `https://react-http-65441-default-rtdb.firebaseio.com//todo.json?orderBy="$key"&equalTo="${todoParams.id}"`
        );
        this.individualTodoData = {
          id: todoParams.id,
          ...(await todoData.json())[todoParams.id],
        };
        console.log(this.individualTodoData);
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoading = false;
    }
  },
});
