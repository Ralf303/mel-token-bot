import { Composer } from "telegraf";
import User from "../db/models/user-model.js";
import pkg from "xlsx";
import fs from "fs";
import path from "path";
import { config } from "dotenv";
import dbService from "../db/service.js";
config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev",
});

const adminHandler = new Composer();

adminHandler.command("add", async (ctx) => {
  try {
    const isAdmin = await dbService.isAdmin(String(ctx.from.id));
    if (!isAdmin) {
      ctx.reply("Команда доступна только админам");
      return;
    }

    const id = ctx?.payload;

    if (id) {
      const result = await dbService.makeAdmin(ctx.payload);

      if (result) {
        return ctx.reply("Админ успешно добавлен");
      }

      return ctx.reply("Такого юзера не существует");
    }

    ctx.reply("Ты не ввел айди");
  } catch (error) {
    console.log(error);
    ctx.reply("Что то пошло не так(");
  }
});

adminHandler.command("table", async (ctx) => {
  try {
    const isAdmin = await dbService.isAdmin(String(ctx.from.id));
    if (!isAdmin) {
      ctx.reply("Команда доступна только админам");
      return;
    }

    const allUsers = await User.findAll();
    const users = allUsers.map((user) => {
      return {
        id: user.id,
        firstname: user.firstname,
        balance: user.balance,
        address: user.address,
        referals: user.referals,
      };
    });
    // Создаем новую книгу Excel
    const workbook = pkg.utils.book_new();
    // Создаем новый лист и добавляем данные в него
    const ws = pkg.utils.json_to_sheet(users);
    pkg.utils.book_append_sheet(workbook, ws, "users");

    // Создаем уникальное имя файла
    const fileName = `users_${Date.now()}.xlsx`;
    const filePath = path.join(process.cwd(), fileName);

    // Записываем книгу в новый файл
    pkg.writeFile(workbook, filePath);
    // Читаем файл как Buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Отправляем файл как документ
    await ctx.replyWithDocument(
      {
        source: fileBuffer,
        filename: fileName,
      },
      { caption: "Готово :)" }
    );

    // Удаляем файл после отправки
    fs.unlinkSync(filePath);
  } catch (error) {
    console.log(error);
    ctx.reply("Что то пошло не так(");
  }
});

export default adminHandler;
