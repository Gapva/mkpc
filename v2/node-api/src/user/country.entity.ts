import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: "mkcountries" })
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  private name_fr: string;

  @Column()
  private name_en: string;

  getName(lang: string) {
    return this[`name_${lang}`] ?? this.name_en;
  }
}