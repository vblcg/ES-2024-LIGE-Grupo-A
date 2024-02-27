package pt.iscte_iul.ista.HelloTwitter;
/*
* See https://twitter4j.org/code-examples

*/
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.v1.Query;
import twitter4j.v1.QueryResult;
import twitter4j.v1.Status;
class Main {
public static void main(String[] args) throws TwitterException {
Twitter twitter = Twitter.getInstance();
Query query = Query.of("source:twitter4j yusukey");
QueryResult result = twitter.v1().search().search(query);
for (Status status : result.getTweets()) {
System.out.println("@" + status.getUser().getScreenName() +
":" + status.getText());
}
}
}