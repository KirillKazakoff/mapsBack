import { Project } from 'ts-morph';
import fs from 'fs';
import path from 'path';

// 1. Инициализируем проект
const project = new Project();
const sourceFile = project.addSourceFileAtPath('src/api/types.ts');

// 2. Получаем вообще все экспортируемые типы из файла
const exportedTypeAliases = sourceFile.getTypeAliases().filter((t) => t.isExported());

let fileContent = '/* eslint-disable */\n// Автоматически сгенерированные типы бэкенда\n\n';

// 3. Проходим циклом по каждому типу
for (const typeAlias of exportedTypeAliases) {
    const typeName = typeAlias.getName();

    // Пропускаем сам служебный DeepPrettify, если он вдруг экспортирован
    if (typeName.startsWith('_DeepPrettify') || typeName === 'DeepPrettify') continue;

    console.log(`⏳ Вычисляю тип: ${typeName}...`);

    // Вычисляем чистую плоскую структуру свойств
    const resolvedTypeText = typeAlias.getType().getText(typeAlias);

    // Добавляем в общий контент файла
    fileContent += `export type ${typeName} = ${resolvedTypeText};\n\n`;
}

// 4. Записываем всё в один файл на фронтенд
const outputPath = path.resolve('../mapsFront/src/types/backend.ts');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, fileContent, 'utf-8');

console.log('✅ Все типы успешно объединены и сгенерированы в backend.ts!');

// import { Project } from 'ts-morph';
// import fs from 'fs';
// import path from 'path';

// // 1. Инициализируем TS проект
// const project = new Project();
// // Добавляем файл, откуда нужно взять готовый тип
// const sourceFile = project.addSourceFileAtPath('src/api/types.ts');

// // 2. Находим нужный тип по названию
// const typeAlias = sourceFile.getTypeAliasOrThrow('SSDCommonT');

// // 3. Заставляем TypeScript вычислить этот тип и вернуть его строковое представление
// const resolvedTypeText = typeAlias.getType().getText(typeAlias);

// // 4. Формируем чистый контент для фронтенда
// const fileContent = `export type SSDCommonT = ${resolvedTypeText};\n`;

// // 5. Записываем файл прямо на фронтенд
// const outputPath = path.resolve('../mapsFront/src/types/backend.ts');
// fs.mkdirSync(path.dirname(outputPath), { recursive: true });
// fs.writeFileSync(outputPath, fileContent, 'utf-8');

// console.log('✅ Типы успешно сгенерированы в backend.ts!');
