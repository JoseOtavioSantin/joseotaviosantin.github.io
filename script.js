// Função para calcular a diferença de dias entre duas datas
function daysDifference(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000; // horas * minutos * segundos * milissegundos
    const diffDays = Math.round(Math.abs((date1 - date2) / oneDay));
    return diffDays;
}

// Função para obter a data atual no formato YYYY-MM-DD
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();

    // Adiciona um zero à esquerda se o mês ou o dia for menor que 10
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return `${year}-${month}-${day}`;
}

// Função para adicionar uma classe CSS com base na diferença de dias
function addClassBasedOnDays(taskElement, dueDate) {
    const currentDate = new Date(getCurrentDate());
    const taskDueDate = new Date(dueDate);
    const difference = daysDifference(taskDueDate, currentDate);

    if (difference <= 0) {
        taskElement.classList.add('task-red'); // Se a tarefa está vencida ou no mesmo dia, adiciona classe vermelha
    } else if (difference <= 3) {
        taskElement.classList.add('task-yellow'); // Se faltam 3 dias ou menos, adiciona classe amarela
    }
}

// Função para salvar as tarefas no armazenamento local
function saveTasks(tasks) {
    if (isLocalStorageSupported()) {
        try {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (error) {
            console.error('Erro ao salvar tarefas:', error);
        }
    } else {
        console.error('O armazenamento local não é suportado neste navegador.');
    }
}

// Função para carregar as tarefas do armazenamento local
function loadTasks() {
    if (isLocalStorageSupported()) {
        try {
            var tasks = localStorage.getItem('tasks');
            return tasks ? JSON.parse(tasks) : [];
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
            return [];
        }
    } else {
        console.error('O armazenamento local não é suportado neste navegador.');
        return [];
    }
}

// Função para exibir as tarefas salvas
function displayTasks(tasks) {
    var taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Limpa a lista antes de exibir as tarefas

    tasks.forEach(function(task, index) {
        var taskListItem = document.createElement("li");
        taskListItem.className = "taskItem";
        taskListItem.innerHTML = '<input type="checkbox" data-index="' + index + '">' + task.name + ' - ' + task.description + ' - ' + task.dueDate;

        // Adiciona a classe CSS com base na diferença de dias
        addClassBasedOnDays(taskListItem, task.dueDate);

        taskList.appendChild(taskListItem);
    });
}

// Função para remover uma tarefa concluída
function removeCompletedTask(index, tasks) {
    tasks.splice(index, 1); // Remove a tarefa do array
    saveTasks(tasks); // Atualiza o armazenamento local
    displayTasks(tasks); // Atualiza a exibição das tarefas
}

// Carrega as tarefas ao carregar a página
document.addEventListener("DOMContentLoaded", function() {
    var tasks = loadTasks();
    displayTasks(tasks);

 // Adiciona evento ao formulário para adicionar novas tarefas
document.getElementById("addTaskForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Previne o envio do formulário

    // Recupera os valores dos campos do formulário e converte para maiúsculas
    var taskName = document.getElementById("taskName").value.toUpperCase();
    var taskDescription = document.getElementById("taskDescription").value.toUpperCase();
    var taskDueDate = document.getElementById("taskDueDate").value;

    // Cria um objeto representando a nova tarefa
    var newTask = {
        name: taskName,
        description: taskDescription,
        dueDate: taskDueDate
    };

    // Adiciona a nova tarefa à lista de tarefas
    tasks.push(newTask);

    // Salva as tarefas atualizadas no armazenamento local
    saveTasks(tasks);

    // Exibe as tarefas atualizadas na lista
    displayTasks(tasks);

    // Limpa o formulário
    document.getElementById("addTaskForm").reset();
});

    // Adiciona evento aos checkboxes para remover tarefas concluídas
    document.addEventListener("change", function(event) {
        if (event.target && event.target.type === "checkbox") {
            var index = event.target.getAttribute("data-index");
            if (event.target.checked) {
                removeCompletedTask(index, tasks);
            }
        }
    });
});

// Função para verificar se o navegador suporta o armazenamento local
function isLocalStorageSupported() {
    try {
        var testKey = 'test';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
}

// Função para atualizar dinamicamente as cores das tarefas com base na data de vencimento
function updateTaskColors(tasks) {
    tasks.forEach(function(task, index) {
        var taskListItem = document.querySelector('.taskItem[data-index="' + index + '"]');
        if (taskListItem) {
            // Remove as classes existentes de cor da tarefa
            taskListItem.classList.remove('task-red', 'task-yellow');

            // Adiciona a classe CSS com base na diferença de dias
            addClassBasedOnDays(taskListItem, task.dueDate);
        }
    });
}

// Atualiza as cores das tarefas periodicamente
setInterval(function() {
    var tasks = loadTasks();
    updateTaskColors(tasks);
}, 60000); // Atualiza a cada minuto (60000 milissegundos)

