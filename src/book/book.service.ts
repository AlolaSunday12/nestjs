import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Book } from './schemas/book.schema';
import { Query } from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  // findAll
  async findAll(query: Query): Promise<Book[]> {
    // Pagination
    const resPerPage = 2;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    const books = await this.bookModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return books;
  }

  // Create a book
  async create(book: Book, user: User): Promise<Book> {
    const data = Object.assign(book, { user: user._id });

    const res = await this.bookModel.create(data);
    return res;
  }

  // findBYId
  async findById(id: string): Promise<Book> {
    const isValidid = mongoose.isValidObjectId(id);

    if (!isValidid) {
      throw new BadRequestException('please enter correct id');
    }
    const book = await this.bookModel.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }
 
  // updteById
  async updateById(id: string, book: Book): Promise<Book> {
    const res = await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
      runValidators: true,
    });
    return res;
  }

  // Delete by Id
  async deleteById(id: string): Promise<Book> {
    const res = await this.bookModel.findByIdAndDelete(id);
    return res;
  }

  // Upload images
  async uploadImages(bookId: string, files: Array<Express.Multer.File>) {
    const book = await this.bookModel.findById(bookId);

    if (!book) {
      throw new NotFoundException('Book not found.');
    }
    const imageUrls = files.map((file) => {
      if (!file.filename) {
        return null;
      }
      const url = `http://localhost:3000/uploads/${file.filename}`;
      return url;
    });

    book.images = imageUrls;
    await book.save();

    return book;
  }
}
