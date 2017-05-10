require_relative '../../app/utils/jobbank_posting_scraper.rb'
require 'pry'

desc "Get job postings from https://www.jobbank.gc.ca/"
task :scrape_jobbank => :environment do
  CITY_CODE_TORONTO = 22437 # Toronto
  PAGES = 100 # go up to 100
  JOB_BANK_ROOT_URL = "https://www.jobbank.gc.ca"

  job_posting_urls = []

  (1..PAGES).each do |page_number|
    puts "Opening page #{page_number}"

    job_bank_url = "#{JOB_BANK_ROOT_URL}/jobsearch/jobsearch?page=#{page_number}&d=50&sort=D&wid=px&cty=#{22437}&action=s0&lang=en"
    doc = Nokogiri::HTML(open(job_bank_url))

    articles = doc.css('article')
    articles.each do |article|
      a_tag = article.css('a')[0]
      job_posting_urls << a_tag.attributes['href'].value.split(';')[0]
    end
  end

  puts "Total job postings: #{job_posting_urls.count}"

  job_posting_urls.each do |page_url|
    begin
      full_url = "#{JOB_BANK_ROOT_URL}#{page_url}"
      scraper = Utils::JobBankPostingScraper.new full_url
      job_data = scraper.get_data
      create_job(job_data)
    rescue => e
      puts "Error scraping job posting: #{e}"
      puts e.backtrace.join("\n")
      next
    end
  end
end

def create_job(job_data)
  posting = Posting.create(job_data)
  if posting.save
    puts "Saved new job: #{posting.title}"
  end
end
