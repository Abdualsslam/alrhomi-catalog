import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';
import { Public } from '../common/decorators/public.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Sitemap')
@Controller('sitemap.xml')
export class SitemapController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get dynamic sitemap.xml' })
  async getSitemap(@Res() res: Response) {
    const domain = process.env.FRONTEND_URL || 'https://catalog.example.com';

    // Fetch categories
    const categoriesData = await this.categoriesService.findAll();
    const categories = Array.isArray(categoriesData)
      ? categoriesData
      : (categoriesData as any).items || [];

    // Fetch products
    const productsData = await this.productsService.findAllPublic({ limit: 5000, page: 1 });
    const products = productsData.items || [];

    // Get latest update date for main pages
    const latestProduct = products[0];
    const latestDate = latestProduct?.updatedAt
      ? new Date(latestProduct.updatedAt).toISOString()
      : new Date().toISOString();

    const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    const xmlFooter = `\n</urlset>`;

    let urls = '';

    // Add main pages
    urls += `
  <url>
    <loc>${domain}/</loc>
    <lastmod>${latestDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${domain}/catalog</loc>
    <lastmod>${latestDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${domain}/categories</loc>
    <lastmod>${latestDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

    // Add categories
    categories.forEach((category: any) => {
      urls += `
  <url>
    <loc>${domain}/catalog?category=${encodeURIComponent(category.name)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // Add products
    products.forEach((product: any) => {
      const updatedAt = product.updatedAt ? new Date(product.updatedAt).toISOString() : latestDate;
      urls += `
  <url>
    <loc>${domain}/product/${product._id}</loc>
    <lastmod>${updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    res.header('Content-Type', 'application/xml');
    res.send(xmlHeader + urls + xmlFooter);
  }
}
