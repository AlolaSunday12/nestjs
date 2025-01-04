import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { extname, join } from 'path';
import * as fs from 'fs';
import { diskStorage } from 'multer';

@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  @Roles(Role.Editor, Role.Admin, Role.User)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAllBooks(@Query() query: ExpressQuery): Promise<Book[]> {
    return this.bookService.findAll(query);
  }

  // create book
  @Post()
  @UseGuards(AuthGuard())
  async createBook(
    @Body()
    book: CreateBookDto,
    @Req() req,
  ): Promise<Book> {
    return this.bookService.create(book, req.user);
  }

  @Get(':id')
  async getBook(
    @Param('id')
    id: string,
  ): Promise<Book> {
    return this.bookService.findById(id);
  }

  @Put(':id')
  async updateBook(
    @Param('id')
    id: string,
    @Body() book: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.updateById(id, book);
  }

  @Delete(':id')
  async deleteBook(
    @Param('id')
    id: string,
  ): Promise<Book> {
    return this.bookService.deleteById(id);
  }

  @Put('upload/:bookId')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const fileExt = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${fileExt}`;
          console.log(`Saving file: ${file.originalname} as ${filename}`);
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadImages(
    @Param('bookId') bookId: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.bookService.uploadImages(bookId, files);
  }
/*
@Get('image/:filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', filename); // Ensure correct path

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    res.sendFile(filePath);
  }
    */
}
