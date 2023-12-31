# Назначение папок

## Текущая папка

Эта папка является промежуточной для разных видов компонентов, которые расположены в конретных подпапках, указанных ниже.<br>
Т.е. в самой этой папке не лежит никаких компонентов, а они лежат в указанных ниже подпапках.

## basic

Простые элементы управления и отображения, которые сами по себе ничего не делают, а лишь отображают то, что им передали.

## global-controls

Глобальные элементы управления и отображения, у которых есть конкретная функция, которую они выполняют сами по себе.

## helpers

Компоненты, которые имеют вспомогательное назначение в рамках всего сайта и не выполняют какой-то функции сами по себе, но позволяют что-то сделать, если им передать на вход соответсвующие параметры.<br>
Отличия от basic в том, что basic это базовые кирпичики из которых всё собирается, в частности контент виджетов на странице, а helpers позволяют сделать что-то глобальное в рамках всего сайта.

## widgets

Компоненты, которые представляют законченный блок контента на странице, который в конечном итоге вставляется в страницу.<br>
Даже если на странице всего один виджет, то основной код лежит в коде виджета, а не в коде страницы.
