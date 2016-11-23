require_relative '../../app/utils/jobbank_posting_scraper.rb'

desc "Get job postings from http://www.jobbank.gc.ca/"
task :scrape_jobbank => :environment do
  CITY_CODE_TORONTO = 22437 # Toronto
  PAGES = 101 # go up to 101
  JOB_BANK_ROOT_URL = "http://www.jobbank.gc.ca/"

  job_posting_urls = []

  (1..PAGES).each do |page_number|
    puts "Opening page #{page_number}"

    job_bank_url = "#{JOB_BANK_ROOT_URL}job_search_results.do?page=#{page_number}&d=50&sort=D&wid=px&cty=#{22437}&action=s0&lang=en"
    doc = Nokogiri::HTML(open(job_bank_url))

    articles = doc.css('article')
    articles.each do |article|
      a_tag = article.css('a')[0]
      job_posting_urls << a_tag.attributes['href'].value
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
