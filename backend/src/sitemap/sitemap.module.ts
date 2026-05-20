import { Module } from '@nestjs/common';
import { SitemapController } from './sitemap.controller';
import { ProductsModule } from '../products/products.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [ProductsModule, CategoriesModule],
  controllers: [SitemapController],
})
export class SitemapModule {}
