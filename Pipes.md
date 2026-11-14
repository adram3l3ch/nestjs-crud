NestJS has three levels of pipe application:

### **1. Global pipes —&#x20;**`app.useGlobalPipes()`

Runs for **all incoming requests across the application**, before the route handler executes.

```
app.useGlobalPipes(new ValidationPipe());
```

### **2. Method-level pipes —&#x20;**`@UsePipes()`

Runs for **all applicable parameters of that particular controller method**.

```
@Post()
@UsePipes(new ValidationPipe())
createUser(
  @Body() body: CreateUserDto,
  @Query() query: QueryDto,
) {
  // ...
}
```

### **3. Parameter-level pipes — directly on decorators**

Runs only for **that particular parameter**.

```
@Get(':id')
findUser(
  @Param('id', ParseIntPipe) id: number,
  @Query('limit', ParseIntPipe) limit: number,
) {
  // ...
}
```

### **Execution order**

NestJS executes pipes in this order:

**Global pipes**

**Controller-level pipes**

**Method-level pipes**

**Parameter-level pipes**

Route handler

**One important distinction:** Pipes transform or validate individual arguments before they reach your handler. They don't validate the entire request object as one indivisible unit.

You've understood the NestJS pipe hierarchy correctly!
