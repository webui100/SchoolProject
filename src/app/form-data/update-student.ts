export const FormPattern: Array<Object> = [
  {
    controlName: "avatar",
    controlType: "file",
    valueType: "file",

    validation: {
      required: false,
      type: false,
      err: ""
    }
  },
  {
    controlName: "lastname",
    controlType: "text",
    valueType: "text",
    placeholder: "Прізвище*",
    validation: {
      required: true,
      type: "ukrNameRegExp",
      err: "Українською та з великої літери.Обов'язкове поле!"
    }
  },
  {
    controlName: "firstname",
    controlType: "text",
    valueType: "text",
    placeholder: "Ім'я*",
    validation: {
      required: true,
      type: "ukrNameRegExp",
      err: "Українською та з великої літери.Обов'язкове поле!"
    }
  },

  {
    controlName: "patronymic",
    controlType: "text",
    valueType: "text",
    placeholder: "По-батькові*",
    validation: {
      required: true,
      type: "ukrNameRegExp",
      err: "Українською та з великої літери.Обов'язкове поле!"
    }
  },
  {
    controlName: "login",
    controlType: "text",
    valueType: "text",
    placeholder: "Логін*",
    validation: {
      required: true,
      type: "loginRegExp",
      err: "Від 5 латинських літер.Обов'язкове поле!"
    }
  },
  {
    controlName: "phone",
    controlType: "text",
    valueType: "text",
    placeholder: "Телефон",
    validation: {
      required: false,
      type: "phoneRegExp",
      err: "Формат +380992244666"
    }
  },
  {
    controlName: "email",
    controlType: "text",
    valueType: "text",
    placeholder: "Електронна скринька",
    validation: {
      required: false,
      type: "emailRegExp",
      err: "Формат example@gmail.com"
    }
  },
  {
    controlName: "dateOfBirth",
    controlType: "date",
    valueType: "text",
    placeholder: "Дата народження*",
    validation: {
      required: true,
      type: false,
      err: "Дата народження. Обов'язкове поле!"
    }
  }
];
