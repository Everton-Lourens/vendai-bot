const MY_JSON = `{
  "database": {
    "stage_0": {
      "message_1": "Bem-vindo(a)"
    },
    "all_items": {
      "message_1": "Escolha sua pizza:\\n——————————\\n1️⃣ → Pequena: R$ 20,00\\n2️⃣ → Média: R$ 25,00\\n3️⃣ → Grande: R$ 30,00\\n4️⃣ → Família: R$ 35,00\\n——————————",
      "1": "f47c3d29-1f76-4d98-8cd7-7fc5d2d6b245",
      "2": "b2d7c4f1-7cc8-4e67-b417-7127f76a8b29",
      "3": "9e5f8a3a-926b-43f1-a2f3-0339b515bbd3",
      "4": "4d2b0a9e-61bc-42e0-9d5b-d6c4e5fcb3d9"
    }
  }
}`;

async function getDatabase() {
  return JSON.parse(MY_JSON);
}

getDatabase().then(database => {
  const teste = database.database.all_items;
  console.log(teste['5']);
});

